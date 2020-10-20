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

import { Debtor } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';
import { inOutAnimation } from '@shared/helpers';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css']
})
export class DebtComponent implements OnInit {

  debtTypeOfFine: string; // penalty, in_day, statutory6%, statutory8%

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

    // TODO: set browser title

    // create validation
    this.addDebtForm = this.formBuilder.group({
      debtName: ['', [Validators.required, Validators.maxLength(128)]],
      debtSum: ['', [Validators.required]],
      debtDate: ['', [Validators.required]],
      debtTypeOfFine: ['', [Validators.required]],
      debtInDayPercent: ['', [Validators.required, Validators.min(0.0001)]],
    });
  }

  // /**
  //  * add validator for input day percent
  //  */
  // private addValidator() {
  //   const debtInDayPercent = this.addDebtForm.controls['debtInDayPercent'];
  //   debtInDayPercent.setValidators([Validators.required, Validators.min(0.0001)]);
  // }

  // /**
  //  * remove validator for input day percent
  //  */
  // private removeValidator() {
  //   const debtInDayPercent = this.addDebtForm.controls['debtInDayPercent'];
  //   debtInDayPercent.clearValidators();
  //   debtInDayPercent.updateValueAndValidity();
  // }

  fine(radioButtonValue: string): void {
    this.debtTypeOfFine = radioButtonValue;
    if (this.debtTypeOfFine !== 'in_day') {
      this.f['debtInDayPercent'].setValue(0.0001);
    }
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

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/debt/store`,
        {
          debtName: this.f['debtName'].value,
          debtSum: this.f['debtSum'].value,
          debtDate: this.f['debtDate'].value,
          debtTypeOfFine: this.f['debtTypeOfFine'].value,
          debtInDayPercent: this.f['debtInDayPercent'].value,
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

  // convenience getter for easy access to form fields
  get f() {
    return this.addDebtForm.controls;
  }
}
