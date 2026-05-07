import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthUser { token: string; username: string; email: string; fullName: string; role: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sub = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.sub.asObservable();
  private readonly URL = '/api/auth';

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('currentUser');
    if (stored) this.sub.next(JSON.parse(stored));
  }

  login(username: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.URL}/login`, { username, password }).pipe(
      tap(user => { localStorage.setItem('currentUser', JSON.stringify(user)); this.sub.next(user); })
    );
  }

  signup(data: any): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.URL}/signup`, data).pipe(
      tap(user => { localStorage.setItem('currentUser', JSON.stringify(user)); this.sub.next(user); })
    );
  }

  logout() { localStorage.removeItem('currentUser'); this.sub.next(null); }
  getToken(): string | null { return this.sub.value?.token || null; }
  getCurrentUser(): AuthUser | null { return this.sub.value; }
  isLoggedIn(): boolean { return !!this.sub.value; }
}
