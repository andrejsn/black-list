import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';

interface ContractWarningPreTrial extends Contract {
  place: string, number: string, days: number, warningDate: Date, saveDoc: boolean
}

@Component({
  selector: 'app-warning-pre-trial',
  templateUrl: './warning-pre-trial.component.html',
  styleUrls: ['./warning-pre-trial.component.scss']
})
export class WarningPreTrialComponent implements OnInit {

  @Input() contract: ContractWarningPreTrial;

  submitted: boolean = false;
  loading: boolean = false;

  warningPreTrialForm = new FormGroup({
    place: new FormControl(),
    number: new FormControl(),
    days: new FormControl(),
    warningDate: new FormControl(new Date()),
    saveDoc: new FormControl()
  });

  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    this.warningPreTrialForm = this.formBuilder.group(
      {
        place: ['', [Validators.required]],
        number: ['', Validators.required],
        days: ['', [Validators.required, Validators.min(1)]],
        warningDate: ['', [Validators.required]],
        saveDoc: ['', '']
      }
    );
    this.warningPreTrialForm.patchValue({ saveDoc: true });
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.warningPreTrialForm.invalid) {
      this.translate.get('toast.error.template.form').subscribe((error: string) => { this.snotifyService.error(error) });

      return;
    }

    this.loading = true;

    this.contract.place = this.warningPreTrialForm.controls['place'].value;
    this.contract.number = this.warningPreTrialForm.controls['number'].value;
    this.contract.days = this.warningPreTrialForm.controls['days'].value;
    this.contract.warningDate = this.warningPreTrialForm.controls['warningDate'].value;
    this.contract.saveDoc = this.warningPreTrialForm.controls['saveDoc'].value;

    this.http.post<any>(`${environment.apiUrl}/pdf/contract/warning/pre/trial`,
      {
        'contract': this.contract
      }, { responseType: 'blob' as 'json' }
    ).pipe(first())
      .subscribe(
        data => {
          console.log(data);


          // window.open(window.URL.createObjectURL(data));
        },
        error => {


          console.log(error);


          this.loading = false;
          this.submitted = false;
          this.translate.get('toast.error.response').subscribe((error: string) => { this.snotifyService.error(error) });
        }
      );
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.warningPreTrialForm.controls;
  }
}
