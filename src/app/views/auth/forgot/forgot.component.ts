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

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  forgotForm: FormGroup = new FormGroup({
    email: new FormControl(),
  });

  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,

    private snotifyService: SnotifyService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
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


  }


  // convenience getter for easy access to form fields
  get f() {
    return this.forgotForm.controls;
  }
}
