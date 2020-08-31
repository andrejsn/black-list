import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { Task } from '@app/models';
import { ObjectsService } from '@shared/services';
import { inOutAnimation, timezoneOffset } from '@shared/helpers';
import { environment } from '@environments/environment';

@Component({
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  animations: [inOutAnimation()],
})
export class TaskComponent implements OnInit {
  task: Task;
  today: Date;

  isUpdateReminder: boolean;

  editTaskForm = new FormGroup({
    taskDate: new FormControl(),
    taskNote: new FormControl(),
    reminderNote: new FormControl(),
    reminderDate: new FormControl(),
  });

  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    if (!this.objectsService.task) {
      // no task cached
      this.router.navigate(['/debtors']);

      return; // ~
    }

    this.task = this.objectsService.task;
    this.today = new Date();
    this.isUpdateReminder = this.task.remind_date ? true : false;

    this.submitted = false;
    this.loading = false;

    // create validation
    this.editTaskForm = this.formBuilder.group(
      {
        taskDate: [
          moment(this.task.date).format('YYYY. DD. MMMM'),
          [Validators.required],
        ],
        taskNote: [this.task.note, [Validators.required]],
        reminderDate: [
          this.task.remind_date
            ? moment(this.task.remind_date).format('YYYY. DD. MMMM')
            : '',
          [],
        ],
        reminderNote: [this.task.remind_note, []],
      },
      { validator: this.remindDateAfterOrEqualTaskDate }
    );
  }

  changedCreateReminder() {
    this.isUpdateReminder = !this.isUpdateReminder;

    const reminderNoteControl = this.editTaskForm.controls['reminderNote'];
    const reminderDateControl = this.editTaskForm.controls['reminderDate'];
    if (this.isUpdateReminder) {
      reminderDateControl.setValidators(Validators.required);
      reminderNoteControl.setValidators(Validators.required);
    } else {
      reminderDateControl.clearValidators();
      reminderDateControl.updateValueAndValidity();

      reminderNoteControl.clearValidators();
      reminderNoteControl.updateValueAndValidity();
    }
  }

  /**
   * Validator: remind Date after or equal task date
   */
  private remindDateAfterOrEqualTaskDate(formGroup: FormGroup): any {
    let taskDateTimestamp, remindDateTimestamp;
    // tslint:disable-next-line: forin
    for (const controlName in formGroup.controls) {
      if (controlName.indexOf('taskDate') !== -1) {
        taskDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
      if (controlName.indexOf('reminderDate') !== -1) {
        remindDateTimestamp = Date.parse(formGroup.controls[controlName].value);
      }
    }

    return remindDateTimestamp < taskDateTimestamp
      ? { remindDateLessTaskDate: true }
      : null;
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editTaskForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/task/update`, this.updateTask())
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['/debtor/tasks']);
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

  private updateTask(): Task {
    const task: Task = {
      id: this.task.id,
      date: timezoneOffset(
        // moment(this.editTaskForm.controls['taskDate'].value).toDate()
        new Date(this.editTaskForm.controls['taskDate'].value)
      ),
      note: this.editTaskForm.controls['taskNote'].value,
    };
    // add reminder?
    if (this.isUpdateReminder) {
      task.remind_date = timezoneOffset(
        // moment(this.editTaskForm.controls['reminderDate'].value).toDate()
        new Date(this.editTaskForm.controls['reminderDate'].value)
      );
      task.remind_note = this.editTaskForm.controls['reminderNote'].value;
    } else {
      task.remind_date = null;
      task.remind_note = null;
    }

    return task;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editTaskForm.controls;
  }
}
