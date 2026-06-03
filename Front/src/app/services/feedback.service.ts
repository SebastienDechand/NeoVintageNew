import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Feedback, FeedbackStats } from '../models/feedback.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/feedbacks`;

  private feedbacksSubject = new BehaviorSubject<Feedback[]>([]);
  feedbacks$ = this.feedbacksSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllFeedbacks();
    }
  }

  loadAllFeedbacks(): void {
    const timestamp = new Date().getTime();
    this.http.get<Feedback[]>(`${this.apiUrl}?nocache=${timestamp}`).subscribe({
      next: (feedbacks) => {
        this.feedbacksSubject.next(feedbacks);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis :', error);
      },
    });
  }

  getFeedbackStats(): Observable<FeedbackStats> {
    return this.http.get<FeedbackStats>(`${this.apiUrl}/stats`);
  }

  addFeedback(feedback: Omit<Feedback, 'id'>): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, feedback).pipe(
      tap(() => this.loadAllFeedbacks())
    );
  }
}
