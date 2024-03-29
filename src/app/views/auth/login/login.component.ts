import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { SnotifyService } from 'ng-snotify';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@app/shared/helpers';


@Component({
  selector: 'app-dashboard',
  styles: ['.forgot{background-color: #20a8d838;}'],
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  returnUrl: string;
  submitted = false;
  loading = false;
  error = false;

  constructor
    (
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private http: HttpClient,
      private snotifyService: SnotifyService,
      private translate: TranslateService,
      private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      },
    );
  }

  onSubmit() {
    this.submitted = true;
    this.error = false;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.translate.get('user.login.error.toast.form').subscribe((error: string) => { this.snotifyService.error(error); });
      return;
    }

    this.loading = true;

    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;

    this.authenticationService.login(email, password).subscribe(
      response => {
        this.authenticationService.setSession(response);
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.loading = false;
        this.error = true;
        this.translate.get('user.login.error.toast.server').subscribe((err: string) => { this.snotifyService.error(err); });
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
}
