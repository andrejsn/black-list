import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@shared/helpers/authentication/';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  // TODO: 403, ... 500 not handled?
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(catchError(err => {
          if (err.status === 401) {
              // auto logout if 401 response returned from api
              this.authenticationService.logout();

              // TODO: route to session time out page
              this.router.navigate(['/auth/login']);
          }

          const error = err.error.error || err.message;
          return throwError(error);
      }));
  }
}
