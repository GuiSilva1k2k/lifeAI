import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError, from, of, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './autenticacaoUser.service';

let isRefreshing = false;
let refreshTokenInProgress$: Observable<string | null> | null = null;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ⚠️ Ignora refresh diretamente
  if (req.url.includes('/api/token/refresh/')) {
    return next(req);
  }

  const token = authService.getToken();

  // 🧠 Se token expirado, tenta renovar antes de enviar qualquer requisição
  if (token && authService.isTokenExpired()) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenInProgress$ = authService.refreshToken().pipe(
        finalize(() => {
          isRefreshing = false;
          refreshTokenInProgress$ = null;
        })
      );
    }

    return refreshTokenInProgress$!.pipe(
      switchMap((newToken) => {
        if (newToken) {
          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next(cloned);
        } else {
          authService.clearToken();
          router.navigate(['/login']);
          return throwError(() => new Error('Refresh token inválido ou expirado'));
        }
      })
    );
  }

  // ✅ Se token válido, adiciona normalmente
  let authReq = req;
  if (token && !authService.isTokenExpired()) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // 🛑 Se já tentou refresh antes, não insista
        if (!refreshTokenInProgress$ && !isRefreshing) {
          isRefreshing = true;
          refreshTokenInProgress$ = authService.refreshToken().pipe(
            finalize(() => {
              isRefreshing = false;
              refreshTokenInProgress$ = null;
            })
          );

          return refreshTokenInProgress$.pipe(
            switchMap((newToken) => {
              if (newToken) {
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                return next(retryReq);
              } else {
                authService.clearToken();
                router.navigate(['/login']);
                return throwError(() => error);
              }
            })
          );
        } else {
          authService.clearToken();
          router.navigate(['/login']);
          return throwError(() => error);
        }
      }

      return throwError(() => error);
    })
  );
};
