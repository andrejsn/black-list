import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { Contract, Debtor } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

interface ContractCalcPay extends Contract {
  company: string;
  reg_number: string;
  address: string;
  calcDate: Date;
  saveDoc: boolean;
}

@Component({
  selector: 'app-debt-calculation',
  templateUrl: './debt-calculation.component.html',
  styleUrls: ['./debt-calculation.component.scss'],
})
export class DebtCalculationComponent implements OnInit {
  @Input() contract: ContractCalcPay;

  submitted: boolean = false;
  loading: boolean = false;

  calcPayForm = new FormGroup({
    calcDate: new FormControl(new Date()),
    saveDoc: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private objectsService: ObjectsService,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void { // TODO: validate contract date <= calc date
    this.calcPayForm = this.formBuilder.group({
      calcDate: ['', [Validators.required]],
      saveDoc: ['', ''],
    });
    this.calcPayForm.patchValue({ saveDoc: true });
  }
  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.calcPayForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    // this.loading = true;

    this.http
      .post<any>(
        `${environment.apiUrl}/pdf/contract/calc`,
        {
          contract_id: this.contract.id,
          calc_date: this.f['calcDate'].value,
          save_doc: this.f['saveDoc'].value
        },
        { responseType: 'blob' as 'json' }
      )
      .pipe(first())
      .subscribe(
        (data) => {
          // console.log(data);

          window.open(window.URL.createObjectURL(data));
        },
        (error) => {
          console.log(error);

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
    return this.calcPayForm.controls;
  }
}
