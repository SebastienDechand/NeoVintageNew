import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  expandedState: { [key: number]: boolean } = {};
  currentStartIndex = 0;
  maxDisplayed = 4;
  averageRating = 0;
  selectedReview: Feedback | null = null;
  private isBrowser: boolean;

  constructor(
    private feedbackService: FeedbackService,
    @Inject(PLATFORM_ID) private platformId: Object // Injection du PLATFORM_ID pour détecter client/serveur
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get visibleReviews(): Feedback[] {
    return this.reviews.slice(
      this.currentStartIndex,
      this.currentStartIndex + this.maxDisplayed
    );
  }

  ngOnInit() {
    if (!this.isBrowser) {
      return;
    }

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

    // Mise à jour du nombre maximum d'éléments affichés
    this.updateMaxDisplayed();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.updateMaxDisplayed();
    }
  }

  private updateMaxDisplayed() {
    if (this.isBrowser) {
      const width = window.innerWidth;
      if (width >= 1440) {
        this.maxDisplayed = 4;
      } else if (width >= 1024) {
        this.maxDisplayed = 3;
      } else if (width >= 768) {
        this.maxDisplayed = 2;
      } else {
        this.maxDisplayed = 1;
      }
    }
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

  toggleReview(index: number) {
    this.expandedState[index] = !this.expandedState[index];
  }

  isExpanded(index: number): boolean {
    return this.expandedState[index] || false;
  }

  openModal(review: Feedback) {
    this.selectedReview = review;
  }

  closeModal() {
    this.selectedReview = null;
  }
}
