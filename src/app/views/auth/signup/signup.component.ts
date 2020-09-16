import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService } from 'ng-snotify';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/shared/helpers';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    password_confirmation: new FormControl(),
    agree: new FormControl(),
  });

  returnUrl: string;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    private snotifyService: SnotifyService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {

    // TODO: set title ?

    this.signupForm = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(32),
          ],
        ],
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
        agree: [false, Validators.required],
      },
      { validator: this.checkPasswords }
    );
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      this.translate
        .get('toast.error.signup_form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;

    const email = this.f['email'].value;
    const password = this.f['password'].value;

    this.http
      .post<any>(`${environment.apiUrl}/auth/signup`, {
        name: this.f['name'].value,
        email: email,
        password: password,
        password_confirmation: this.f['password_confirmation'].value,
        agree: this.f['agree'].value,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          // login in new account
          this.authenticationService
            .login(email, password)
            .subscribe((response) => {
              this.authenticationService.setSession(response);
              this.router.navigate(['/']);
            });
        },
        (error) => {
          this.loading = false;
          // TODO: Http failure response error?
          this.translate
            .get('toast.error.email_exist')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  /*
   * check password confirm
   */
  private checkPasswords(formGroup: FormGroup) {
    //
    const pass = formGroup.get('password').value;
    const confirmPass = formGroup.get('password_confirmation').value;

    return pass === confirmPass ? null : { notsame: true };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }
}
