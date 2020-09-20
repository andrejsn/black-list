import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';
import { first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { bgColorAnimation } from '@shared/helpers';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  animations: [bgColorAnimation()],
})
export class VerifyComponent implements OnInit {
  token: string;
  isValidated: boolean;
  isError: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snotifyService: SnotifyService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isValidated = false;
    this.isError = false;

    this.token = this.route.snapshot.paramMap.get('token');

    // clear url string
    this.router.navigate(['/auth/verify/1']);

    setTimeout(() => {}, 2200);

    // test reset url
    this.http
      .post<any>(`${environment.apiUrl}/auth/verify`, {
        token: this.token,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          if (data && data.success) {
            this.isValidated = true;
          }
        },
        (error) => {
          this.isError = true;
          this.translate
            .get('toast.email.validate.error')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }
}
