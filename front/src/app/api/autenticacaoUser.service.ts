import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { loginUser, registroUser } from '../models/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiRegistro = 'http://localhost:8000/registro/';
  private apiLogin = 'http://localhost:8000/login/';
  private apiLogout = 'http://localhost:8000/logout/';
  private apiRefresh = 'http://localhost:8000/api/token/refresh/';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  registerUser(data: { username: string; email: string; password: string }): Observable<registroUser> {
    return this.http.post<registroUser>(this.apiRegistro, data).pipe(catchError(this.handleError));
  }

  loginUser(data: { email: string; password: string }): Observable<loginUser> {
    return this.http.post<loginUser>(this.apiLogin, data).pipe(
      map((res: any) => {
        if (res.access) {
          this.saveToken(res.access);
        }
        if (res.refresh) {
          this.saveRefreshToken(res.refresh);
        }
        return res;
      }),
      catchError(this.handleError)
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.loggedIn.next(true);
  }

  saveRefreshToken(refresh: string): void {
    localStorage.setItem('refresh_token', refresh);
  }

  clearToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const logged = !!token && !this.isTokenExpired();
    this.loggedIn.next(logged);
    return logged;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  refreshToken(): Observable<string | null> {
    const refresh = this.getRefreshToken();
    if (!refresh) return of(null);

    return this.http.post<any>(this.apiRefresh, { refresh }).pipe(
      map((res: any) => {
        const newAccess = res.access;
        if (newAccess) {
          this.saveToken(newAccess);
          return newAccess;
        }
        return null;
      }),
      catchError(() => {
        this.clearToken();
        return of(null);
      })
    );
  }

  logoutUser(): Observable<any> {
    this.clearToken();
    return this.http.post(this.apiLogout, {}).pipe(catchError(this.handleError));
  }

  setLoggedIn(value: boolean): void {
    this.loggedIn.next(value);
  }

  private hasToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch {
      return false;
    }
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}