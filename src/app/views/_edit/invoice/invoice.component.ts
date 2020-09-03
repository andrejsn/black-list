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

import { Debtor, Contract, Invoice, InvoiceStatus } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';
import { timezoneOffset } from '@shared/helpers';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  selectedDebtor: Debtor;
  selectedContract: Contract;
  selectedInvoice: Invoice;
  invoiceStatus = InvoiceStatus;

  editInvoiceForm = new FormGroup({
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
    if (
      !this.objectsService.debtor &&
      !this.objectsService.contract &&
      !this.objectsService.invoice
    ) {
      // no debtor&contract&invoice cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;
    this.selectedContract = this.objectsService.contract;
    this.selectedInvoice = this.objectsService.invoice;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- edit guarantor');
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
        route: '/edit/invoice',
        name: 'Edit invoice: ' + this.selectedInvoice.number,
        active: true,
      },
    ]);

    // create validation
    const regexPattern: RegExp = new RegExp('^[1-9]{1,5}d*$');
    this.editInvoiceForm = this.formBuilder.group(
      {
        number: [this.selectedInvoice.number, [Validators.required]],
        invoiceDate: [
          moment(this.selectedInvoice.date).format('YYYY. DD. MMMM'),
          [Validators.required],
        ],
        dateTo: [
          moment(this.selectedInvoice.date_to).format('YYYY. DD. MMMM'),
          [Validators.required],
        ],
        sum: [
          this.selectedInvoice.sum,
          [Validators.required, Validators.min(0.01)],
        ],
        pay_in_days: [
          // this.selectedInvoice.???,
          12345,
          [Validators.required, Validators.pattern(regexPattern)],
        ],
        status: [this.selectedInvoice.status, [Validators.required]],
        note: [this.selectedInvoice.note, []],
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
    if (this.editInvoiceForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.http
      .post<any>(`${environment.apiUrl}/invoice/update`, this.updateInvoice())
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

  private updateInvoice(): Invoice {
    return {
      id: this.selectedInvoice.id,
      contract_id: this.selectedContract.id,
      number: this.editInvoiceForm.controls['number'].value,
      date: timezoneOffset(
        moment(
          this.editInvoiceForm.controls['invoiceDate'].value,
          'YYYY. DD. MMMM'
        ).toDate()
      ),
      date_to: timezoneOffset(
        moment(
          this.editInvoiceForm.controls['dateTo'].value,
          'YYYY. DD. MMMM'
        ).toDate()
      ),
      sum: this.editInvoiceForm.controls['sum'].value,
      status: this.editInvoiceForm.controls['status'].value,
      note: this.editInvoiceForm.controls['note'].value,
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editInvoiceForm.controls;
  }
}
