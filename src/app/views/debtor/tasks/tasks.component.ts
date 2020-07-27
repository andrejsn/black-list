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

interface CalendarTableElement extends Calendar {
  visible: boolean;
  isChecked: boolean;
}
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  debtor: Debtor;
  calendarList: CalendarTableElement[];
  addMode: boolean;
  isCreateReminder: boolean;

  submitted: boolean = false;
  loading: boolean = false;

  addTaskForm = new FormGroup({
    newTaskDate: new FormControl(new Date()),
    newTaskNote: new FormControl(),
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

    this.addMode = false;
    this.isCreateReminder = false;
    this.debtor = this.debtorCachedService.debtor;

    // create validators
    this.addTaskForm = this.formBuilder.group({
      newTaskDate: ['', [Validators.required]],
      newTaskNote: ['', [Validators.required]],
    });

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
    this.addMode = false;
  }

  changedCreateReminder() {
    this.isCreateReminder = !this.isCreateReminder;
    console.log(this.isCreateReminder);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addTaskForm.controls;
  }
}
