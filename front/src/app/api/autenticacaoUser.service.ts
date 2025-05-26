import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { loginUser, registroUser } from '../models/user';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiRegistro = 'http://localhost:8000/registro/';
  private apiLogin = 'http://localhost:8000/login/';
  private apiLogout = 'http://localhost:8000/logout/';

  constructor(private http: HttpClient) {}

  registerUser(data: { username: string; email: string; password: string }): Observable<registroUser> {
    return this.http.post<registroUser>(this.apiRegistro, data).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(data: { email: string; password: string }): Observable<loginUser> {
    return this.http.post<loginUser>(this.apiLogin, data).pipe(
      catchError(this.handleError)
    );
  }

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  saveToken(token: string): void {
  localStorage.setItem('access_token', token);
    this.loggedIn.next(true); // Atualiza status de login
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    const logged = !!token;
    this.loggedIn.next(logged); // atualiza o estado reativo
    return logged;
  }


  setLoggedIn(value: boolean): void {
    this.loggedIn.next(value);
  }

  logoutUser(): Observable<any> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.setLoggedIn(false);
    return this.http.post(this.apiLogout, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
