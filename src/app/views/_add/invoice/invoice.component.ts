import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
} from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  selectedDebtor: Debtor;
  selectedContract: Contract;
  invoiceStatus = InvoiceStatus;

  addInvoiceForm = new FormGroup({
    number: new FormControl(),
    invoiceDate: new FormControl(),
    dateTo: new FormControl(),
    sum: new FormControl(),
    pay_in_days: new FormControl(),
    status: new FormControl(),
    note: new FormControl(),
  });

  submitted: boolean = false;
  loading: boolean = false;

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
    if (!this.objectsService.debtor && !this.objectsService.contract) {
      // no debtor&contract cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;
    this.selectedContract = this.objectsService.contract;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- add guarantor');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: false },
      {
        route: '/debtor',
        name: 'Debtor: ' + this.selectedDebtor.company,
        active: false,
      },
      {
        route: '/contract',
        name: 'Contract: ' + this.selectedContract.number,
        active: true,
      },
      {
        route: '/add/invoice',
        name: 'Add invoice',
        active: true,
      },
    ]);

    // create validation
    const regexPattern: RegExp = new RegExp('^[1-9]{1,5}d*$');
    this.addInvoiceForm = this.formBuilder.group(
      {
        number: ['', [Validators.required]],
        invoiceDate: ['', [Validators.required]],
        dateTo: ['', [Validators.required]],
        sum: ['', [Validators.required, Validators.min(0.01)]],
        pay_in_days: [
          '',
          [Validators.required, Validators.pattern(regexPattern)],
        ],
        status: [null, [Validators.required]],
        note: ['', []],
      },
      { validator: this.dateTo_less_invoiceDate }
    );
  }

  /**
   * Validator: DateTo after or equals InvoiceDate
   */
  private dateTo_less_invoiceDate(formGroup: FormGroup): any {
    let invoiceDateTimestamp, invoiceDateToTimestamp;
    // tslint:disable-next-line: forin
    for (const controlName in formGroup.controls) {
      if (controlName.indexOf('invoiceDate') !== -1) {
        invoiceDateTimestamp = Date.parse(
          formGroup.controls[controlName].value
        );
      }
      if (controlName.indexOf('dateTo') !== -1) {
        invoiceDateToTimestamp = Date.parse(
          formGroup.controls[controlName].value
        );
      }
    }
    return invoiceDateToTimestamp < invoiceDateTimestamp
      ? { dateToLessInvoiceDate: true }
      : null;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addInvoiceForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/invoice/store`, this.initNewInvoice())
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['/debtor/contracts']);
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

  private initNewInvoice(): Invoice {
    return {
      contract_id: this.selectedContract.id,

      number: this.addInvoiceForm.controls['number'].value,
      date: this.addInvoiceForm.controls['invoiceDate'].value,
      date_to: this.addInvoiceForm.controls['dateTo'].value,
      sum: this.addInvoiceForm.controls['sum'].value,
      status: this.addInvoiceForm.controls['status'].value,
      note: this.addInvoiceForm.controls['note'].value,
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addInvoiceForm.controls;
  }
}
