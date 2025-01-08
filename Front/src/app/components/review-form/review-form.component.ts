import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../services/feedback.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  reviewForm: FormGroup;
  showForm = false;
  isSubmitting = false;
  submitSuccess = false;

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
}
