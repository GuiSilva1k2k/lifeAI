import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { loginUser, registroUser } from '../models/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiRegistro = 'http://localhost:8000/registro/';
  private apiLogin = 'http://localhost:8000/login/';
  private apiLogout = 'http://localhost:8000/logout/';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // REGISTRO
  registerUser(data: { username: string; email: string; password: string }): Observable<registroUser> {
    return this.http.post<registroUser>(this.apiRegistro, data).pipe(
      catchError(this.handleError)
    );
  }

  // LOGIN
  loginUser(data: { email: string; password: string }): Observable<loginUser> {
    return this.http.post<loginUser>(this.apiLogin, data).pipe(
      catchError(this.handleError)
    );
  }

  // SALVA TOKEN
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.loggedIn.next(true);
  }

  // LIMPA TOKEN
  clearToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedIn.next(false);
  }

  // OBTÉM TOKEN
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // VERIFICA SE ESTÁ LOGADO
  isLoggedIn(): boolean {
    const token = this.getToken();
    const logged = !!token;
    this.loggedIn.next(logged);
    return logged;
  }

  // VERIFICAÇÃO DO TOKEN (opcional)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // LOGOUT
  logoutUser(): Observable<any> {
    this.clearToken();
    return this.http.post(this.apiLogout, {}).pipe(
      catchError(this.handleError)
    );
  }

  setLoggedIn(value: boolean): void {
    this.loggedIn.next(value);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
