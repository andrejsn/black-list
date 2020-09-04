import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';
import * as moment from 'moment';

import {
  Debtor,
  Contract,
  Guarantor,
  InvoiceStatus,
  Invoice,
  Payment,
  PaymentStatus,
} from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

enum Mode {
  add,
  edit,
  saved,
}
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  @Input() invoice: Invoice;
  payments: Payment[];
  selectedPayment: Payment;
  paymentToDelete: Payment;
  paymentStatus = PaymentStatus;
  mode: Mode;

  submitted: boolean;
  loading: boolean;

  addEditPaymentForm = new FormGroup({
    sum: new FormControl(),
    date: new FormControl(),
    status: new FormControl(),
  });

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private translate: TranslateService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    this.mode = Mode.edit;
    this.payments = this.invoice.payments;
    this.selectedPayment = null;
    this.paymentToDelete = null;
    this.submitted = true; // TODO: change this

    // create validation
    this.addEditPaymentForm = this.formBuilder.group({
      sum: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  changeMode(payment: Payment) {
    this.selectedPayment = payment;
    if (this.mode === Mode.edit) {
      // set input fields
      this.addEditPaymentForm.controls['date'].setValue(
        moment(this.selectedPayment.date).format('YYYY. DD. MMMM')
      );
      this.addEditPaymentForm.controls['sum'].setValue(
        this.selectedPayment.sum
      );
      this.addEditPaymentForm.controls['status'].setValue(
        this.selectedPayment.status
      );
      // change mode to saved
      this.mode = Mode.saved;
    } else {
      this.mode = Mode.edit;
    }
  }

  isSaved(currentPayment: Payment): boolean {
    return (
      this.selectedPayment &&
      this.selectedPayment.id === currentPayment.id &&
      this.mode === Mode.saved
    );
  }

  isEdit(currentPayment: Payment): boolean {
    return !this.isSaved(currentPayment);
  }

  cancelEdit() {
    this.mode = Mode.edit;
  }

  addPayment() {
    this.mode = Mode.add;
    this.submitted = false;
    this.addEditPaymentForm.controls['date'].setValue(null);
    this.addEditPaymentForm.controls['sum'].setValue(null);
    this.addEditPaymentForm.controls['status'].setValue(null);
  }

  isAddPayment(): boolean {
    return this.mode === Mode.add;
  }

  cancelAddPayment() {
    this.mode = Mode.edit;
    this.submitted = true;
  }

  savePayment() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addEditPaymentForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/payment/store`, this.initPayment())
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);
          this.loading = false;
          this.submitted = false;
        },
        (error) => {
          this.loading = false;
          this.submitted = false;
          this.translate
            .get('toast.error.response')
            .subscribe((error: string) => {
              this.snotifyService.error(error);
            });
        }
      );

    console.log(this.addEditPaymentForm.controls['date'].value);
    console.log(this.addEditPaymentForm.controls['sum'].value);
    console.log(this.addEditPaymentForm.controls['status'].value);
  }

  private initPayment(): Payment {
    return {
      invoice_id: this.invoice.id,
      date: this.addEditPaymentForm.controls['date'].value,
      sum: this.addEditPaymentForm.controls['sum'].value,
      status: this.addEditPaymentForm.controls['status'].value,
    };
  }

  notifyDeletePayment(payment: Payment) {
    this.paymentToDelete = payment;
    this.loading = true;

    this.snotifyService
      .confirm('The payment will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes',
            action: () => this.deletePayment(payment),
            bold: false,
          },
          {
            text: 'No',
            action: () => this.cancelDeletePayment(payment),
          },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeletePayment(payment);
      });
  }

  private cancelDeletePayment(paymentToDelete: Payment) {
    this.loading = false;
    this.paymentToDelete = null;
  }

  private deletePayment(paymentToDelete: Payment) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.addEditPaymentForm.controls;
  }
}
