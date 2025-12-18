import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Don't add auth header for login/register endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  // Clone request and add authorization header if token exists and not an auth endpoint
  let clonedReq = req;
  if (token && !isAuthEndpoint) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle all requests (with or without token) and catch errors
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - redirect to login (except for auth endpoints)
      if (error.status === 401 && !isAuthEndpoint) {
        // Clear token and redirect to login
        localStorage.removeItem('crewnet_token');
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
          replaceUrl: true
        });
      }
      return throwError(() => error);
    })
  );
};
