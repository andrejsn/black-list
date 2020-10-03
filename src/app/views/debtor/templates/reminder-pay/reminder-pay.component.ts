import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation, requiredIfValidator } from '@shared/helpers';


@Component({
  selector: 'app-reminder-pay',
  templateUrl: './reminder-pay.component.html',
  styleUrls: ['./reminder-pay.component.scss'],
  animations: [inOutAnimation()]
})
export class ReminderPayComponent implements OnInit {

  @Input() contract: Contract;

  submitted: boolean = false;
  loading: boolean = false;

  reminderPayForm = new FormGroup({
    place: new FormControl(),
    remindNumber: new FormControl(),
    withinDays: new FormControl(),
    remindDate: new FormControl(new Date()),
    isSaveToDocs: new FormControl(),
    documentDescription: new FormControl()
  });

  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    this.reminderPayForm.patchValue({ isSaveToDocs: false });
    this.reminderPayForm = this.formBuilder.group(
      {
        place: ['', [Validators.required]],
        remindNumber: ['', Validators.required],
        withinDays: ['', [Validators.required, Validators.min(1)]],
        remindDate: ['', [Validators.required]],
        isSaveToDocs: ['', ''],
        documentDescription: ['', [
          Validators.minLength(3),
          Validators.maxLength(128),
          // https://medium.com/ngx/3-ways-to-implement-conditional-validation-of-reactive-forms-c59ed6fc3325
          requiredIfValidator(() => this.f['isSaveToDocs'].value)
        ]]
      }
    );

    this.f['isSaveToDocs'].valueChanges.subscribe(


      value => { this.f['documentDescription'].updateValueAndValidity(); console.log(this.f['isSaveToDocs'].value); }
    );
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.reminderPayForm.invalid) {
      this.translate.get('toast.error.template.form').subscribe((error: string) => { this.snotifyService.error(error) });

      return;
    }

    // this.loading = true;

    this.http.post<any>(`${environment.apiUrl}/pdf/contract/remind`,
      {
        contract_id: this.contract.id,
        document_place: this.f['place'].value,
        remind_number: this.f['remindNumber'].value,
        remind_date: this.f['remindDate'].value,
        within_days: this.f['withinDays'].value,
        save_doc: this.f['isSaveToDocs'].value,
        document_description: this.f['documentDescription'].value
      }, { responseType: 'blob' as 'json' }
    ).pipe(first())
      .subscribe(
        data => {
          // console.log(data);


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
    return this.reminderPayForm.controls;
  }
}
