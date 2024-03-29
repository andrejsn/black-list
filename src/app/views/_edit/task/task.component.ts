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

import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { Debtor, Contract, Task } from '@app/models';
import { ObjectsService } from '@shared/services';
import { inOutAnimation, timezoneOffset } from '@shared/helpers';
import { environment } from '@environments/environment';

@Component({
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  animations: [inOutAnimation()],
})
export class TaskComponent implements OnInit {
  selectedDebtor: Debtor;
  selectedTask: Task;
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
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private translate: TranslateService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    if (!this.objectsService.debtor && !this.objectsService.task) {
      // no task cached
      this.router.navigate(['/debtors']);

      return; // ~
    }
    this.selectedTask = this.objectsService.task;
    this.selectedDebtor = this.objectsService.debtor;

    this.today = new Date();
    this.isUpdateReminder = this.selectedTask.remind_date ? true : false;

    this.submitted = false;
    this.loading = false;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- edit guarantor');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: false },
      {
        route: '/debtor',
        name: 'Debtor: ' + this.selectedDebtor.company,
        active: false,
      },
      {
        route: '/edit/task',
        name:
          'Edit task from: ' +
          moment(this.selectedTask.date).format('YYYY. DD. MMMM'),
        active: true,
      },
    ]);

    // create validation
    this.editTaskForm = this.formBuilder.group(
      {
        taskDate: [
          moment(this.selectedTask.date).format('YYYY. DD. MMMM'),
          [Validators.required],
        ],
        taskNote: [this.selectedTask.note, [Validators.required]],
        reminderDate: [
          this.selectedTask.remind_date
            ? moment(this.selectedTask.remind_date).format('YYYY. DD. MMMM')
            : '',
          [],
        ],
        reminderNote: [this.selectedTask.remind_note, []],
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
      .post<any>(`${environment.apiUrl}/task/update`, this.updatedTask())
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

  private updatedTask(): Task {
    const task: Task = {
      id: this.selectedTask.id,
      debtor_id: this.selectedDebtor.id,
      date: timezoneOffset(
        moment(
          this.editTaskForm.controls['taskDate'].value,
          'YYYY. DD. MMMM'
        ).toDate()
      ),
      note: this.editTaskForm.controls['taskNote'].value,
    };
    // add reminder?
    if (this.isUpdateReminder) {
      (task.remind_date = timezoneOffset(
        moment(
          this.editTaskForm.controls['reminderDate'].value,
          'YYYY. DD. MMMM'
        ).toDate()
      )),
        (task.remind_note = this.editTaskForm.controls['reminderNote'].value);
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
