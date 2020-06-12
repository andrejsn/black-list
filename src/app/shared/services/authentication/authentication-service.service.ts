import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from "moment";
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(email:string, password:string) {

this.http.post<any>(`${environment.apiUrl}/auth/login`,
      {
        'email': email,
        'password': password,

      }
    ).pipe(first())
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log('error = ' + error);
        }
      );

  }



}
