import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../services/feedback.service';
import { finalize } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class ReviewsComponent implements OnInit {
  reviews: Feedback[] = [];
  reviewForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  submitSuccess = false;
  currentStartIndex = 0;
  maxDisplayed = 5;
  averageRating = 0;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      authorInitials: ['', [Validators.required, Validators.maxLength(3)]],
      productName: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      consent: [false, Validators.requiredTrue]
    });
  }

  get visibleReviews(): Feedback[] {
    return this.reviews.slice(
      this.currentStartIndex,
      this.currentStartIndex + this.maxDisplayed
    );
  }

  ngOnInit() {
    this.feedbackService.feedbacks$.subscribe({
      next: (feedbacks) => {
        console.log('Avis reçus dans ReviewsComponent :', feedbacks); // Vérifiez ici
        this.reviews = feedbacks;
        this.calculateAverageRating();
      },
      error: (error) => console.error('Erreur lors du chargement des avis :', error),
    });

    this.feedbackService.getFeedbackStats().subscribe({
      next: (stats) => {
        this.averageRating = stats.averageRating;
      },
      error: (error) => console.error('Erreur lors du chargement des statistiques:', error)
    });
  }

  next() {
    const maxStart = Math.max(0, this.reviews.length - this.maxDisplayed);
    this.currentStartIndex = Math.min(this.currentStartIndex + 1, maxStart);
  }

  previous() {
    this.currentStartIndex = Math.max(0, this.currentStartIndex - 1);
  }

  selectRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;

      const newFeedback: Omit<Feedback, 'id'> = {
        ...this.reviewForm.value,
        date: new Date(),
        verified: true
      };

      this.feedbackService.addFeedback(newFeedback)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
          next: () => {
            this.submitSuccess = true;
            this.reviewForm.reset();
            setTimeout(() => {
              this.submitSuccess = false;
              this.showForm = false;
            }, 3000);
            this.feedbackService.loadAllFeedbacks();
          },
          error: (error) => {
            console.error('Erreur lors de l\'ajout de l\'avis:', error);
          }
        });
    }
  }

  private calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }

    const sum = this.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }

  forceReload(): void {
    console.log('Forçage du rechargement des avis...');
    this.feedbackService.loadAllFeedbacks();
  }

}
