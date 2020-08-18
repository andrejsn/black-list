import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { Debtor } from '@app/models';
import { Calendar } from '@app/models/calendar';
import { environment } from '@environments/environment';
import { DebtorCachedService } from '@shared/services';
import { inOutAnimation } from '@shared/helpers';

interface CalendarTableElement extends Calendar {
  visible: boolean;
  isChecked: boolean;
}

interface Task {
  debtor_id: number;
  date: Date;
  note: string;
  remind_date?: Date;
  remind_note?: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  // animations: [inOutAnimation()],
})
export class TasksComponent implements OnInit {
  debtor: Debtor;
  today: Date;

  calendarList: CalendarTableElement[];
  addMode: boolean;
  isCreateReminder: boolean;

  submitted: boolean = false;
  loading: boolean = false;

  addTaskForm = new FormGroup({
    taskDate: new FormControl(new Date()),
    taskNote: new FormControl(),
    reminderNote: new FormControl(),
    reminderDate: new FormControl(new Date()),
  });

  constructor(
    private debtorCachedService: DebtorCachedService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    if (!this.debtorCachedService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    this.today = new Date();
    this.debtor = this.debtorCachedService.debtor;
    this.addMode = false;

    // create validators
    this.addTaskForm = this.formBuilder.group(
      {
        taskDate: ['', [Validators.required]],
        taskNote: ['', [Validators.required]],
        reminderNote: ['', [Validators.required]],
        reminderDate: ['', [Validators.required]],
      },
      { validator: this.remindDateAfterOrEqualTaskDate }
    );
    // this.addTaskForm.valueChanges.subscribe((form: any) => {
    //   console.log('form changed to: ' + form);
    // });

    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/debtor/` + this.debtor.id + `/calendars`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.calendarList = data;

          console.log(this.calendarList);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * Validator: remind Date after or equal task date
   */
  private remindDateAfterOrEqualTaskDate(formGroup: FormGroup): any {
    console.log('VALIDATOR RUN');

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
   * toggle row
   */
  toggle(calendarList: CalendarTableElement[], index: number) {
    for (let i = 0; i < calendarList.length; i++) {
      const debtor = calendarList[i];
      const selector = `.row-num-${i}`;

      if (i === index) {
        document.querySelector(selector).classList.toggle('d-none');
        debtor.visible = !debtor.visible;
      } else {
        document.querySelector(selector).classList.add('d-none');
        debtor.visible = false;
      }
    }
  }

  /**
   * on check done
   */
  onChecked(calendar: CalendarTableElement) {
    console.log(calendar.isChecked); // {}, true || false

    // TODO get to server - change done
  }

  /**
   * add new task
   */
  addTask() {
    this.addMode = true;
    this.isCreateReminder = false;
    this.addTaskForm.get('reminderDate').disable();
    this.addTaskForm.get('reminderNote').disable();
  }

  /**
   * submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addTaskForm.invalid) {
      // console.log('###');
      // console.log(this.addTaskForm.hasError('remindDateLessTaskDate'));

      this.translate
        .get('toast.error.template.form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }

    this.addMode = false;
    // this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/add/task`, this.initNewTask())
      .pipe(first())
      .subscribe(
        (data) => {
          this.calendarList = data;
          // console.log(this.calendarList);
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

  changedCreateReminder() {
    this.isCreateReminder = !this.isCreateReminder;
    console.log(this.isCreateReminder);

    if (this.isCreateReminder) {
      this.addTaskForm.get('reminderDate').enable();
      this.addTaskForm.get('reminderNote').enable();
    } else {
      this.addTaskForm.get('reminderDate').disable();
      this.addTaskForm.get('reminderNote').disable();
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addTaskForm.controls;
  }
}
