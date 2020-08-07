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

  // TODO: read from server?
  periods = ['month', 'half_year', 'year'];
  selectedPeriod: string;
  pays = [50, 250, 500];
  selectedPay: number;
  saves = [0, 50, 100];
  selectedSave: number;

  paymentForm: FormGroup = new FormGroup({});

  constructor(
    // private formBuilder: FormBuilder,
    private translate: TranslateService,
    // private http: HttpClient,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // // TODO: unused
    // this.paymentForm = this.formBuilder.group({});
  }

  /**
   * submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    // TODO: unused
    // if (this.paymentForm.invalid) {
    //   this.translate.get('toast.error.payment').subscribe((error: string) => {
    //     this.snotifyService.error(error);
    //   });

    //   return;
    // }

    // stop here is period nas no value
    if (!this.selectedPeriod) {
      this.translate.get('toast.error.payment').subscribe((error: string) => {
        this.snotifyService.error(error);
      });

      this.loading = true;


    }
  }

  selectPaymentFor(period: string) {
    if (this.periods.includes(period)) {
      this.selectedPeriod = period;
      // find index
      const i = this.periods.indexOf(this.selectedPeriod);
      // get pay and saved $
      this.selectedPay = this.pays[i];
      this.selectedSave = this.saves[i];

      localStorage.setItem('pay', JSON.stringify(this.selectedPay));

      // console.log(this.selectedPeriod );
      // console.log(this.selectedPay);
      // console.log(this.selectedSave);
    } else {
      // TODO: period contains not in arrays? Who?... hack :-/
    }
  }

  // convenience getter for easy access to form fields
  // TODO: unused?
  // get f() {
  //   return this.paymentForm.controls;
  // }
}
