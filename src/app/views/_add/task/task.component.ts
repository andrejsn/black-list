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

import { Task, Debtor } from '@app/models';
import { DebtorCachedService } from '@shared/services';
import { inOutAnimation } from '@shared/helpers';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  animations: [inOutAnimation()],
})
export class TaskComponent implements OnInit {
  debtor: Debtor;
  today: Date;
  isCreateReminder: boolean;

  addTaskForm = new FormGroup({
    taskDate: new FormControl(new Date()),
    taskNote: new FormControl(),
    reminderNote: new FormControl(),
    reminderDate: new FormControl(new Date()),
  });

  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private debtorCachedService: DebtorCachedService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    if (!this.debtorCachedService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return; // ~
    }

    this.debtor = this.debtorCachedService.debtor;
    this.today = new Date();
    this.isCreateReminder = false;
    this.loading = false;

    // create validation
    this.addTaskForm = this.formBuilder.group(
      {
        taskDate: ['', [Validators.required]],
        taskNote: ['', [Validators.required]],
        reminderDate: ['', []],
        reminderNote: ['', []],
      },
      { validator: this.remindDateAfterOrEqualTaskDate }
    );
  }

  changedCreateReminder() {
    this.isCreateReminder = !this.isCreateReminder;

    const reminderDateControl = this.addTaskForm.controls['reminderDate'];
    const reminderNoteControl = this.addTaskForm.controls['reminderNote'];
    if (this.isCreateReminder) {
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
    if (this.addTaskForm.invalid) {
      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/add/task`, this.initNewTask())
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

  private initNewTask(): Task {
    const task: Task = {
      debtor_id: this.debtor.id,
      date: this.addTaskForm.controls['taskDate'].value,
      note: this.addTaskForm.controls['taskNote'].value,
    };
    // add reminder?
    if (this.isCreateReminder) {
      task.remind_date = this.addTaskForm.controls['reminderDate'].value;
      task.remind_note = this.addTaskForm.controls['reminderNote'].value;
    }

    return task;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.addTaskForm.controls;
  }
}
