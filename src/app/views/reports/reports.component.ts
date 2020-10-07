import { Component, OnInit } from '@angular/core';
import { inOutAnimation } from '@shared/helpers';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [inOutAnimation()],
})
export class ReportsComponent implements OnInit {
  submitted: boolean;

  // step1: boolean;
  isSumNotOk: boolean;
  withContract: boolean;
  penalty: boolean;
  noPenalty: boolean;
  withoutContract: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;

  constructor(private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    this.reset();


    this.step2 = false;

    this.snotifyService.info('Hello world');
  }

  doSomething(event) {
    console.log('hello from input sum');
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
    this.isSumNotOk
      = this.withContract
      = this.penalty
      = this.noPenalty
      = this.withoutContract
      = this.step2
      = this.step3
      = this.step4 = false;
  }

  // convenience getter for easy access to form fields
  get f() {
    return null; // this.addDebtorForm.controls;
  }
}
