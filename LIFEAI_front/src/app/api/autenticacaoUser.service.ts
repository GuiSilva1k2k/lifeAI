import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { loginUser } from '../models/user';
import { registroUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiRegistro = 'http://localhost:8000/registro/';
  private apiLogin = 'http://localhost:8000/login/';

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

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
