import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

  constructor() {
    this.loadAllFeedbacks();
  }

  private loadAllFeedbacks(): void {
    this.http.get<Feedback[]>(this.apiUrl).pipe(
      map(feedbacks => feedbacks.map(feedback => ({
        ...feedback,
        date: new Date(feedback.date)
      })))
    ).subscribe(
      feedbacks => this.feedbacksSubject.next(feedbacks),
      error => console.error('Erreur de chargement des avis:', error)
    );
  }

  getFeedbackStats(): Observable<FeedbackStats> {
    return this.http.get<FeedbackStats>(`${this.apiUrl}/stats`);
  }

  addFeedback(feedback: Omit<Feedback, 'id'>): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, feedback).pipe(
      tap(newFeedback => {
        const currentFeedbacks = this.feedbacksSubject.value;
        this.feedbacksSubject.next([newFeedback, ...currentFeedbacks]);
      })
    );
  }
}
