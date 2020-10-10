import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';
import { bgColorAnimation, inOutAnimation } from '@shared/helpers';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [inOutAnimation(), bgColorAnimation()],
})
export class ReportsComponent implements OnInit {
  submitted: boolean;

  // step1: boolean;
  isSumOk: boolean;
  validateStep1: boolean;
  withContract: boolean;
  penalty: boolean;
  noPenalty: boolean;
  withoutContract: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;

  calculationDebtForm: FormGroup = new FormGroup({
    sum: new FormControl(),
  });

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private router: Router,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // TODO: set title

    // init validators
    this.calculationDebtForm = this.formBuilder.group({
      sum: ['', [Validators.required, Validators.min(99.99)]]
    });

    this.reset();


    this.step2 = false;

    this.snotifyService.info('Hello world');
  }

  doStep1() {
    console.log(this.f['sum'].value);

   this.isSumOk =  this.f['sum'].value > 99.99;
  }

  goStep2() {
    console.log('hello from step 2');
    this.step2 = true;
  }

  goStep3() {
    console.log('hello from step 3');
    this.step3 = true;
  }

  goStep4() {
    console.log('hello from step 4');
    this.step4 = true;
  }

  recalculate() {
    this.reset();
  }

  private reset() {
    this.validateStep1
      = this.isSumOk
      = this.withContract
      = this.penalty
      = this.noPenalty
      = this.withoutContract
      = this.step2
      = this.step3
      = this.step4 = false;
  }

  onSubmit() {
    console.log('hello from submit');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.calculationDebtForm.controls;
  }
}
