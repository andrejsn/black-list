import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { PaymentStatus, Payment } from '@app/models';
import { environment } from '@environments/environment';
import * as moment from 'moment';


@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {

  @Input() payment: Payment;
  paymentDate: Date;
  paymentStatus = PaymentStatus;

  submitted: boolean = false;
  loading: boolean = false;

  addPaymentForm: FormGroup = new FormGroup(
    {
      date: new FormControl(),
      sum: new FormControl(),
      status: new FormControl()
    }
  );

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService) { }


  ngOnInit(): void {
    const date = this.payment ? moment(this.payment.date) : moment();
    date.locale('lv');

    this.addPaymentForm = this.formBuilder.group(
      {
        date: [date.format('LL'), [Validators.required]],
        sum: [this.payment ? this.payment.sum : '', [Validators.required, Validators.min(0.01)]],
        status: [this.payment ? this.payment.status : null, [Validators.required]],
      }
    );
  }

  /**
   * submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addPaymentForm.invalid) {
      this.translate.get('toast.error.form.payment').subscribe((error: string) => { this.snotifyService.error(error) });

      return;
    }

    this.loading = true;

    this.http.post<any>(`${environment.apiUrl}/add/payment`,
      {
        // 'company': this.addDebtorForm.controls['company'].value,
        // 'reg_number': this.addDebtorForm.controls['reg_number'].value,
        // 'debt': this.addDebtorForm.controls['debt'].value,
        // 'legal_address': this.addDebtorForm.controls['legal_address'].value,
        // 'city': this.addDebtorForm.controls['city'].value,
        // 'postal_code': this.addDebtorForm.controls['postal_code'].value,
        // 'country': this.addDebtorForm.controls['country'].value,
        // 'phone': this.addDebtorForm.controls['phone'].value,
        // 'fax': this.addDebtorForm.controls['fax'].value,
        // 'email': this.addDebtorForm.controls['email'].value,
        // 'homepage': this.addDebtorForm.controls['homepage'].value,
        // 'bank_name': this.addDebtorForm.controls['bank_name'].value,
        // 'bank_account_number': this.addDebtorForm.controls['bank_account_number'].value,
        // 'status': this.addDebtorForm.controls['status'].value,
        // 'note': this.addDebtorForm.controls['note'].value,
      }
    ).pipe(first())
      .subscribe(
        data => {
          console.log(data);

        },
        error => {
          this.loading = false;
          this.submitted = false;
          this.translate.get('toast.error.response').subscribe((error: string) => { this.snotifyService.error(error) });
        }
      );

  }


  // convenience getter for easy access to form fields
  get f() {
    return this.addPaymentForm.controls;
  }
}
