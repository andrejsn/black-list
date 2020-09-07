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

import { Debtor, TypeOfFine } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

enum Agreement {
  withAgreement,
  withOutAgreement,
}
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css'],
})
export class ContractComponent implements OnInit {
  selectedDebtor: Debtor;
  agreement = Agreement;
  typeOfFine = TypeOfFine;

  addContractForm = new FormGroup({
    status: new FormControl(),
    number: new FormControl(),
    contractDate: new FormControl(),
    pay_term_days: new FormControl(),
    fine_per_year: new FormControl(),
    fine_per_day: new FormControl(),
    max_fine_percent: new FormControl(),
    type_of_fine: new FormControl(),

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
    if (!this.objectsService.debtor) {
      // no debtor&contract cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- add contract');
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
        route: '/add/contract',
        name: 'Add contract',
        active: true,
      },
    ]);

    // create validation
    const regexPattern: RegExp = new RegExp('^[1-9]{1,5}d*$');
    this.addContractForm = this.formBuilder.group({
      status: [null, [Validators.required]],
      number: ['', [Validators.required]],
      contractDate: ['', [Validators.required]],
      pay_term_days: [
        '',
        [Validators.required, Validators.pattern(regexPattern)],
      ],
      fine_per_year: ['', [Validators.required]],
      fine_per_day: ['', [Validators.required]],
      max_fine_percent: [
        '',
        [Validators.required, Validators.pattern(regexPattern)],
      ],
      type_of_fine: [null, [Validators.required]],
      note: ['', []],
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addContractForm.invalid) {
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
    return this.addContractForm.controls;
  }
}
