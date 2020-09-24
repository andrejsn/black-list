import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-warning-pre-trial',
  templateUrl: './warning-pre-trial.component.html',
  styleUrls: ['./warning-pre-trial.component.scss']
})
export class WarningPreTrialComponent implements OnInit {

  @Input() contract: Contract;

  submitted: boolean = false;
  loading: boolean = false;

  warningPreTrialForm = new FormGroup({
    place: new FormControl(),
    warningPreTrialNumber: new FormControl(),
    within_days: new FormControl(),
    warningPreTrialDate: new FormControl(new Date()),
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
        warningPreTrialNumber: ['', Validators.required],
        within_days: ['', [Validators.required, Validators.min(1)]],
        warningPreTrialDate: ['', [Validators.required]],
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

    // this.loading = true;

    this.http.post<any>(`${environment.apiUrl}/pdf/contract/warning/pretrial`,
      {
        contract_id: this.contract.id,
        document_place: this.f['place'].value,
        warning_pre_trial_number: this.f['warningPreTrialNumber'].value,
        warning_pre_trial_date: this.f['warningPreTrialDate'].value,
        within_days: this.f['within_days'].value,
        save_doc: this.f['saveDoc'].value
      }, { responseType: 'blob' as 'json' }
    ).pipe(first())
      .subscribe(
        data => {

          window.open(window.URL.createObjectURL(data));
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
