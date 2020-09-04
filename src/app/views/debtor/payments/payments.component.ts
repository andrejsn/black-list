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
  deletePayment: Payment;
  paymentStatus = PaymentStatus;
  mode: Mode;

  submitted: boolean;

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
    this.deletePayment = null;
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

  notifyDeletePayment(paymentToDelete: Payment) {
    this.deletePayment = paymentToDelete;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addEditPaymentForm.controls;
  }
}
