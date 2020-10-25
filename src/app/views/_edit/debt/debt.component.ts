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

import { Debt } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';
import { timezoneOffset } from '@shared/helpers';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css']
})
export class DebtComponent implements OnInit {
  debtToEdit: Debt;
  debtTypeOfFine: string; // penalty, in_day, in_year_6, in_year_8

  addDebtForm = new FormGroup({
    name: new FormControl(),
    debt: new FormControl(),
    debtDate: new FormControl(),
    debtTypeOfFine: new FormControl(),
    debtInDayPercent: new FormControl()
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
  ) { }

  ngOnInit(): void {
    if (!this.objectsService.debt) {
      // no debt cached
      this.router.navigate(['/debts']);

      return;
    }
    this.debtToEdit = this.objectsService.debt;

    // TODO: set browser title

    // create validation
    moment.locale('lv');
    this.addDebtForm = this.formBuilder.group({
      debtName: [this.debtToEdit.name, [Validators.required, Validators.maxLength(128)]],
      debtSum: [this.debtToEdit.sum, [Validators.required]],
      debtDate: [moment(this.debtToEdit.date, 'YYYY-MM-DD').format('LL'), [Validators.required]],
      debtTypeOfFine: [this.debtToEdit.typeOfFine, [Validators.required]],
      debtInDayPercent: [this.debtToEdit.inDayPercent, []],
    });
  }

  fine(radioButtonValue: string): void {
    this.debtTypeOfFine = radioButtonValue;
    if (this.debtTypeOfFine === 'in_day') {
      this.f['debtInDayPercent'].setValidators(
        [
          Validators.required,
          Validators.min(0.0001),
          Validators.max(100.0),
          Validators.maxLength(8)
        ]);
    } else {
      this.f['debtInDayPercent'].clearValidators();
    }
    this.f['debtInDayPercent'].updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addDebtForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    if (this.debtTypeOfFine !== 'in_day') {
      this.f['debtInDayPercent'].setValue(null);
    }

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/debt/update`,
        {
          id: this.debtToEdit.id,
          name: this.f['debtName'].value,
          sum: this.f['debtSum'].value,
          date: timezoneOffset(moment(this.f['debtDate'].value, 'YYYY. DD. MMMM').toDate()),
          typeOfFine: this.f['debtTypeOfFine'].value,
          inDayPercent: this.f['debtInDayPercent'].value,
        }
      )
      .pipe(first())
      .subscribe(
        (data) => {
          // this.router.navigate(['/debtor/tasks']);
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

  resetForm() {
    this.f['debtName'].setValue(this.debtToEdit.name);
    this.f['debtSum'].setValue(this.debtToEdit.sum);
    this.f['debtDate'].setValue(moment(this.debtToEdit.date, 'YYYY-MM-DD').format('LL'));
    this.f['debtTypeOfFine'].setValue(this.debtToEdit.typeOfFine);
    this.f['debtInDayPercent'].setValue(this.debtToEdit.inDayPercent);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addDebtForm.controls;
  }
}


