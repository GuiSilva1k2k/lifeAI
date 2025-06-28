import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './autenticacaoUser.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // 🛑 Não adicionar o header Authorization para o endpoint de refresh
  if (req.url.includes('/api/token/refresh/')) {
    return next(req);
  }

  // ✅ Adiciona o token se houver
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se deu erro 401, tenta renovar o token
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            if (newToken) {
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(newReq);
            } else {
              authService.clearToken();
              router.navigate(['/login']);
              return throwError(() => error);
            }
          })
        );
      }

      // Outros erros continuam normalmente
      return throwError(() => error);
    })
  );
};
