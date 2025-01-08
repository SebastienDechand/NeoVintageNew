import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../services/feedback.service';
import { ReviewFormComponent } from "../review-form/review-form.component";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: true,
  imports: [CommonModule, ReviewFormComponent]
})
export class ReviewsComponent implements OnInit {
  reviews: Feedback[] = [];
  currentStartIndex = 0;
  maxDisplayed = 5;
  averageRating = 0;

  constructor(private feedbackService: FeedbackService) {}

  get visibleReviews(): Feedback[] {
    return this.reviews.slice(
      this.currentStartIndex,
      this.currentStartIndex + this.maxDisplayed
    );
  }

  ngOnInit() {
    this.feedbackService.feedbacks$.subscribe({
      next: (feedbacks) => {
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

  private calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }

    const sum = this.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }

  getPositiveReviewsPercentage(): number {
    const positiveReviews = this.reviews.filter(review => review.rating >= 4).length;
    return Math.round((positiveReviews / this.reviews.length) * 100);
  }
}
