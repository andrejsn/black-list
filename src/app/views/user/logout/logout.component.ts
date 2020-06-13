import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../shared/helpers/authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.http.post<any>(`${environment.apiUrl}/auth/logout`, {}).pipe(first()).subscribe();
    // TODO: test not this -> this.authenticationService.logout()
    this.authenticationService.logout();
  }

}
