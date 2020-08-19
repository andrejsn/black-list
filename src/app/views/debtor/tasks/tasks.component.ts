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

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  debtor: Debtor;
  calendarList: CalendarTableElement[];

  constructor(
    private debtorCachedService: DebtorCachedService,
    private router: Router,
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

    this.debtor = this.debtorCachedService.debtor;

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
   * delete task with id
   * @param id - calendar id
   */
  notifyDeleteTask(calendar: CalendarTableElement, index: number) {
    const selector = `.note-num-${index}`;
    document.querySelector(selector).classList.toggle('to-delete');

    this.snotifyService.confirm('The task will be deleted', 'Are you sure?', {
      timeout: 5000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        { text: 'Yes', action: () => this.deleteTask(calendar), bold: false },
        { text: 'No', action: () => this.cancelDeleteTask(index) },
      ],
    });
  }

  private cancelDeleteTask(index: number) {
    const selector = `.note-num-${index}`;
    document.querySelector(selector).classList.toggle('to-delete');
  }

  private deleteTask(calendar: CalendarTableElement) {

  }
}
