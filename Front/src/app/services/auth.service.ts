import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AdminCredentials, AdminResponse } from '../models/admin.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private tokenSubject: BehaviorSubject<string | null>;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
    this.tokenSubject = new BehaviorSubject<string | null>(token);
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  login(credentials: AdminCredentials): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
        }
        this.tokenSubject.next(response.token);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
