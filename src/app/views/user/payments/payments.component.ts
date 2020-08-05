import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  submitted: boolean = false;
  loading: boolean = false;

  paymentForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({});
  }

  /**
   * submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.paymentForm.invalid) {
      this.translate.get('toast.error.payment').subscribe((error: string) => {
        this.snotifyService.error(error);
      });

      return;
    }

    // this.loading = true;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.paymentForm.controls;
  }
}
