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

  typeOfFine: string; // penalty, in_day, statutory6%, statutory8%

  addDebtForm = new FormGroup({
    name: new FormControl(),
    debt: new FormControl(),
    debtDate: new FormControl(),
    typeOfFine: new FormControl(),
    inDayPercent: new FormControl()
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
      name: ['', [Validators.required, Validators.maxLength(128)]],
      debt: ['', [Validators.required]],
      debtDate: ['', [Validators.required]],
      typeOfFine: ['', [Validators.required]],
      inDayPercent: ['', []],
    });
  }

  /**
   * add validator for input day percent
   */
  private addValidator() {
    const inDayPercentControl = this.addDebtForm.controls['inDayPercent'];
    inDayPercentControl.setValidators(Validators.required);
  }

  /**
   * remove validator for input day percent
   */
  private removeValidator() {
    const inDayPercentControl = this.addDebtForm.controls['inDayPercent'];
    inDayPercentControl.clearValidators();
    inDayPercentControl.updateValueAndValidity();
  }

  fine(radioButtonValue: string): void {
    this.typeOfFine = radioButtonValue;
    if (this.typeOfFine === 'in_day') {
      this.addValidator();
    } else {
      this.removeValidator();
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
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addDebtForm.controls;
  }
}
