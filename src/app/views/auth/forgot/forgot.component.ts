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
import { bgColorAnimation, inOutAnimation } from '@shared/helpers';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
  animations: [inOutAnimation(), bgColorAnimation()],
})
export class ForgotComponent implements OnInit {
  forgotForm: FormGroup = new FormGroup({
    email: new FormControl(),
  });

  submitted = false;
  loading = false;

  message_after_send: string;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,

    private snotifyService: SnotifyService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.message_after_send = null;
    // init validator
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgotForm.invalid) {
      this.translate
        .get('toast.error.form.forgot')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    // send email to server
    this.http
      .post<any>(`${environment.apiUrl}/auth/forgot`, {
        email: this.f['email'].value,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          this.submitted = false;
          this.loading = true;
          this.translate
            .get('toast.password.forgot.email_sent')
            .subscribe((ok: string) => {
              this.snotifyService.info(ok);
            });
          setTimeout(() => {
            this.message_after_send =
              'The email with further instructions was sent to the submitted email address. If you don’t receive a message in 5 minutes, check the junk folder. ';
          }, 2200);
        },
        (error) => {
          this.submitted = false;
          this.loading = true;
          // TODO: Http failure response error?
          this.translate.get('toast.error.').subscribe((err: string) => {
            this.snotifyService.error(error);
          });
          setTimeout(() => {
            this.loading = false;
          }, 5500);
        }
      );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotForm.controls;
  }
}
