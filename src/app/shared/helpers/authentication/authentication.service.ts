import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from "moment";
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {

    return this.http.post<any>(`${environment.apiUrl}/auth/login`,
      {
        'email': email,
        'password': password,
      }
    ).pipe(first())
  }

  /*
  * set in session local storage
  */
  setSession(authResult: { access_token: string; expires_in: moment.DurationInputArg1; }) {
    localStorage.setItem('access_token', authResult.access_token);
    const expiresAt = moment().add(authResult.expires_in, 'second');

    localStorage.setItem('expires_in', JSON.stringify(expiresAt.valueOf()));
  }


  /*
  * remove stored user session items
  */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  private getExpiration() {
    const expiration = localStorage.getItem("expires_in");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

}
