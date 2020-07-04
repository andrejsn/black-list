import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';

interface ContractRemindPay extends Contract {
  place: string, number: string, days: string, remindDate: Date, saveDoc: boolean
}


@Component({
  selector: 'app-reminder-pay',
  templateUrl: './reminder-pay.component.html',
  styleUrls: ['./reminder-pay.component.css']
})
export class ReminderPayComponent implements OnInit {

  @Input() contract: ContractRemindPay;

  submitted: boolean = false;
  loading: boolean = false;

  reminderPayForm = new FormGroup({
    place: new FormControl(),
    number: new FormControl(),
    days: new FormControl(),
    remindDate: new FormControl(new Date()),
    saveDoc: new FormControl()
  });

  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    this.reminderPayForm = this.formBuilder.group(
      {
        place: ['', [Validators.required]],
        number: ['', Validators.required],
        days: ['', [Validators.required, Validators.min(1)]],
        remindDate: ['', [Validators.required]],
        saveDoc: ['', '']
      }
    );
    this.reminderPayForm.patchValue({ saveDoc: true });
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

    this.loading = true;

    this.contract.place = this.reminderPayForm.controls['place'].value;
    this.contract.number = this.reminderPayForm.controls['number'].value;
    this.contract.days = this.reminderPayForm.controls['days'].value;
    this.contract.remindDate = this.reminderPayForm.controls['remindDate'].value;
    this.contract.saveDoc = this.reminderPayForm.controls['saveDoc'].value;

    this.http.post<any>(`${environment.apiUrl}/pdf/contract/remind`,
      {
        'contract': this.contract
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
