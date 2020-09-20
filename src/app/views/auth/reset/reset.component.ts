import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService } from 'ng-snotify';

import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';
import { strict } from 'assert';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  animations: [inOutAnimation()],
})
export class ResetComponent implements OnInit {
  token: string;
  key: string;

  submitted: boolean;
  loading: boolean;
  isErrorOccured: boolean;
  isPasswordChanged: boolean;

  resetForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
    password_confirmation: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,

    private snotifyService: SnotifyService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isErrorOccured = false;
    this.isPasswordChanged = false;

    this.token = this.route.snapshot.paramMap.get('token');
    this.key = this.route.snapshot.queryParamMap.get('key');

    // clear url string
    this.router.navigate(['/auth/reset/from?email']);

    // test reset url
    this.http
      .post<any>(`${environment.apiUrl}/auth/test`, {
        token: this.token,
        key: this.key,
      })
      .pipe(first())
      .subscribe(
        (data) => {},
        (error) => {
          // link is invalid - navigate to ooops page
          this.router.navigate(['/auth/error']);
        }
      );

    // TODO: set title?

    // set Validators
    this.resetForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(32),
          ],
        ],
        password_confirmation: [''],
      },
      { validator: this.checkPasswords }
    );
  }

  /*
   * check password confirm
   // TODO: refactoring ? 3x!this function in components
   */
  private checkPasswords(formGroup: FormGroup) {
    //
    const pass = formGroup.get('password').value;
    const confirmPass = formGroup.get('password_confirmation').value;

    return pass === confirmPass ? null : { notsame: true };
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetForm.invalid) {
      this.translate
        .get('toast.error.reset_form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    // this.loading = true;

    this.http
      .post<any>(`${environment.apiUrl}/auth/reset`, {
        email: this.f['email'].value,
        password: this.f['password'].value,
        password_confirmation: this.f['password_confirmation'].value,
        token: this.token,
        key: this.key,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          this.submitted = false;
          this.loading = true;
          if (data && data.success) {
            this.translate
              .get('toast.password.changed.ok')
              .subscribe((ok: string) => {
                this.snotifyService.info(ok);
              });
            setTimeout(() => {
              this.isPasswordChanged = true;
            }, 5500);
          }
        },
        (error) => {
          this.submitted = false;
          this.loading = true;
          // TODO: Http failure response error?
          this.translate
            .get('toast.password.reset.error')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
          setTimeout(() => {
            this.isErrorOccured = true;
          }, 5500);
        }
      );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls;
  }
}
