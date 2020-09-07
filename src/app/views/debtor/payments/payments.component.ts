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

import { Invoice, Payment, PaymentStatus } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';
import { timezoneOffset } from '@shared/helpers';

enum Mode {
  add,
  saved,
  editable,
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
  isEditMode: boolean;

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
    this.mode = Mode.saved;
    this.isEditMode = false;
    this.payments = this.invoice.payments;
    this.selectedPayment = null;
    this.paymentToDelete = null;
    this.submitted = false;

    // create validation
    this.addEditPaymentForm = this.formBuilder.group({
      sum: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', [Validators.required]],
      status: [null, [Validators.required]],
    });
  }

  changeMode(payment: Payment) {
    this.selectedPayment = payment;

    if (this.mode === Mode.saved) {
      this.mode = Mode.editable;
      this.isEditMode = true;
      this.submitted = false;

      // set input fields
      this.addEditPaymentForm.controls['date'].setValue(
        moment(payment.date).format('YYYY. DD. MMMM')
      );
      this.addEditPaymentForm.controls['sum'].setValue(payment.sum);
      this.addEditPaymentForm.controls['status'].setValue(payment.status);
    } else {
      this.updatePayment(payment.id);
    }
  }

  private updatePayment(id: number) {
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
    const updatePayment: Payment = this.initPayment();
    updatePayment.id = id;
    this.http
      .post<any>(`${environment.apiUrl}/payment/update`, updatePayment)
      .pipe(first())
      .subscribe(
        (data) => {
          // TODO: error?
          if (data) {
            const index = this.payments.findIndex(
              (payment) => payment.id === id
            );
            this.payments[index] = updatePayment;
            this.invoice.payments = this.payments;

            this.isEditMode = false;
            this.loading = false;
          }
        },
        (error) => {
          this.submitted = false;
          this.loading = false;
          this.isEditMode = false;

          this.translate
            .get('toast.error.response')
            .subscribe((error: string) => {
              this.snotifyService.error(error);
            });
        }
      );

    this.mode = Mode.saved;
  }

  isEditable(currentPayment: Payment): boolean {
    return (
      this.selectedPayment &&
      this.selectedPayment.id === currentPayment.id &&
      this.mode === Mode.editable
    );
  }

  isSaved(currentPayment: Payment): boolean {
    return !this.isEditable(currentPayment);
  }

  cancelEdit() {
    this.mode = Mode.saved;
    this.isEditMode = false;
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
    this.mode = Mode.saved;
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
          this.submitted = false;
          this.loading = false;
          // reset mode
          this.mode = Mode.saved;

          const addedPayment = data as Payment;
          if (addedPayment.id) {
            // payment is added
            this.payments.push({
              id: addedPayment.id,
              invoice_id: addedPayment.invoice_id,
              date: addedPayment.date,
              sum: addedPayment.sum,
              status: addedPayment.status,
            });
          }

          console.log(this.payments);
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
  }

  private initPayment(): Payment {
    return {
      invoice_id: this.invoice.id,
      date: timezoneOffset(
        moment(
          this.addEditPaymentForm.controls['date'].value,
          'YYYY. DD. MMMM'
        ).toDate()
      ),
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

  private deletePayment(paymentToDelete: Payment) {
    this.http
      .post<any>(`${environment.apiUrl}/payment/destroy`, {
        id: paymentToDelete.id,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          const response = data;
          // TODO: data.error ?
          if (response.deleted) {
            this.payments = reject(this.payments, function (payment: Payment) {
              return (payment.id as number) === (response.deleted as number);
            });
            this.invoice.payments = this.payments;
          }
        },
        (error) => {
          this.loading = false;
          this.translate
            .get('toast.error.response')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addEditPaymentForm.controls;
  }
}
