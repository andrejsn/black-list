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

import { Debtor, Contract, Guarantor, InvoiceStatus } from '@app/models';
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
    date: new FormControl(),
    date_to: new FormControl(),
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
    this.addInvoiceForm = this.formBuilder.group({
      number: ['', [Validators.required]],
      date: ['', [Validators.required]],
      date_to: ['', [Validators.required]],
      sum: ['', [Validators.required]],
      pay_in_days: [
        '',
        [Validators.required, Validators.pattern(regexPattern)],
      ],
      status: [null, [Validators.required]],
      note: ['', []],
    });
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
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addInvoiceForm.controls;
  }
}
