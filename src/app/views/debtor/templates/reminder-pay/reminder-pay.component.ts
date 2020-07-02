import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';


import { Contract } from '@app/models';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-reminder-pay',
  templateUrl: './reminder-pay.component.html',
  styleUrls: ['./reminder-pay.component.css']
})
export class ReminderPayComponent implements OnInit {

  @Input() contract: Contract;

  submitted: boolean = false;
  loading: boolean = false;

  reminderPayForm = new FormGroup({
    place: new FormControl(),
    number: new FormControl(),
    days: new FormControl(),
    date: new FormControl(new Date()),
  });

  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    console.log(this.contract);

    this.reminderPayForm = this.formBuilder.group(
      {
        place: ['', [Validators.required]],
        number: ['', Validators.required],
        days: ['', [Validators.required]],
        date: ['', [Validators.required]]
      }
    );


  }

  /**
   *
   */
  onSubmit() {
console.log(this.reminderPayForm.controls['date'].value);




    this.submitted = true;

    // stop here if form is invalid
    if (this.reminderPayForm.invalid) {
      this.translate.get('toast.error.template.form').subscribe((error: string) => { this.snotifyService.error(error) });

      return;
    }

    this.loading = true;
  }




  // convenience getter for easy access to form fields
  get f() {
    return this.reminderPayForm.controls;
  }
}
