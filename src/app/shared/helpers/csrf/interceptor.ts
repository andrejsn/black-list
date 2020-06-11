import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpXsrfTokenExtractor } from "@angular/common/http";
import { Observable } from "rxjs";

// see: https://stackoverflow.com/questions/61063479/csrf-token-mismatch-laravel-sanctum-and-angular-http

@Injectable()
export class Interceptor implements HttpInterceptor {
  headerName = 'XSRF-TOKEN';

  constructor(private tokenService: HttpXsrfTokenExtractor) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
    //  withCredentials: true
  });

  return next.handle(request);

    // if (request.method === 'GET' || request.method === 'HEAD'){

    //   return next.handle(request);
    // }

    // const token = this.tokenService.getToken();
    // console.log('########' + this.tokenService);



    // localStorage.setItem('token', token);


    // // Be careful not to overwrite an existing header of the same name.
    // if (token !== null && !request.headers.has(this.headerName))
    // {
    //   request = request.clone({headers: request.headers.set(this.headerName, token)});
    // }
    // return next.handle(request);

    //######################################

    // const customReq = request.clone({

    // });
    // return next.handle(customReq);
  }
}
