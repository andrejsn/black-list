import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const access_token = localStorage.getItem('access_token');

    if (access_token) {
      request = request.clone(
        {
          setHeaders:
          {
            Authorization: `Bearer ${access_token}`
          }
        });
    }

    return next.handle(request);

  }
}
