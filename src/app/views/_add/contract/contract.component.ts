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

enum Agreement {
  with, without
}
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  selectedDebtor: Debtor;

  addContractForm = new FormGroup({
    number: new FormControl(),
    date: new FormControl(),
    pay_term_days: new FormControl(),
    fine_per_year: new FormControl(),
    fine_per_day: new FormControl(),
    max_fine_percent: new FormControl(),
    type_of_fine: new FormControl(),
    note: new FormControl(),
  });

  constructor() { }

  ngOnInit(): void {
  }

}
