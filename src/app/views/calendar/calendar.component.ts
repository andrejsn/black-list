import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import * as range from 'lodash.range';
import * as reject from 'lodash.reject';
import { SnotifyService } from 'ng-snotify';
import { first } from 'rxjs/operators';

import { Debtor, Task } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

interface Month {
  firstDay: moment.Moment;
  weeks: Array<CalendarDate[]>;
}

interface CalendarDate {
  mDate: moment.Moment;
  reminds?: Remind[];
  today?: boolean;
}

interface Remind {
  id: number;
  debtor_id: number;
  debtor_company: string;
  date: moment.Moment;
  done: string;
  note: string;
  type: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [inOutAnimation()],
})
export class CalendarComponent implements OnInit {
  selectedDate: CalendarDate;
  remindsVisible: boolean;
  selectedMonth: moment.Moment;
  calendarMonth: Month = { firstDay: null, weeks: [] };

  public namesOfDays: string[] = [];
  reminds: Remind[] = [];
  firstRemind: moment.Moment;
  lastRemind: moment.Moment;

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private snotifyService: SnotifyService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // set browser title
    this.title.setTitle('Calendar');
    // set breadcrumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/calendar', name: 'Calendar', active: true },
    ]);

    this.remindsVisible = false;
    this.selectedMonth = moment();
    this.firstRemind = moment();
    this.lastRemind = moment();

    moment.locale('lv'); // TODO: read locale from storage
    this.namesOfDays = moment.weekdays();
    this.namesOfDays.push(
      /*set monday as week start*/ this.namesOfDays.shift()
    );

    // get reminders
    this.http
      .get<any>(`${environment.apiUrl}/get/user/tasks`, {})
      .pipe(first())
      .subscribe(
        (data) => {
          const tmp = data as Task[];
          this.reminds = tmp.map((task) => {
            const remindDate = moment(task.remind_date, 'YYYY-MM-DD');
            // set first remind
            this.firstRemind = this.firstRemind.isBefore(remindDate)
              ? this.firstRemind
              : remindDate;
            // set last remind
            this.lastRemind = this.lastRemind.isAfter(remindDate)
              ? this.lastRemind
              : remindDate;
            return {
              id: task.id,
              debtor_id: task.debtor_id,
              debtor_company: task.debtor_company,
              date: remindDate,
              done: task.remind_done,
              note: task.remind_note,
              type: this.remindType(moment(task.remind_date, 'YYYY-MM-DD')),
            };
          });

          this.generateCalendarOfMonth();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private remindType(date: moment.Moment): string {
    if (this.isToday(date)) {
      return 'warning';
    } else if (this.isInFuture(date)) {
      return 'info';
    }
    return 'danger';
  }

  /**
   * generate calendar of month
   */
  private generateCalendarOfMonth() {
    const firstDay = moment([
      this.selectedMonth.year(),
      this.selectedMonth.month(),
      1,
    ]);
    const dates = this.fillDates(firstDay);

    const weeks = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }

    this.calendarMonth = { firstDay: firstDay, weeks: weeks };
  }

  /**
   * fill dates for month calendar
   */
  private fillDates(currentMoment: moment.Moment) {
    const firstOfMonth = moment(currentMoment)
      .startOf('month')
      ./*set monday as week start*/ subtract(1, 'days')
      .day();

    const lastOfMonth = moment(currentMoment)
      .endOf('month')
      ./*set monday as week start*/ subtract(1, 'days')
      .day();

    const firstDayOfGrid = moment(currentMoment)
      .startOf('month')
      .subtract(firstOfMonth, 'days');
    const lastDayOfGrid = moment(currentMoment)
      .endOf('month')
      .subtract(lastOfMonth, 'days')
      .add(7, 'days');
    const startCalendar = firstDayOfGrid.date();

    return range(
      startCalendar,
      startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days')
    ).map((date) => {
      const newDate = moment(firstDayOfGrid).date(date);
      return {
        mDate: newDate,
        reminds: this.goReminds(newDate),
        today: this.isToday(newDate),
      };
    });
  }

  /**
   * has task in prev month
   */
  hasTaskInPrevMonth(): boolean {
    return this.firstRemind.isBefore(this.selectedMonth, 'month');
  }

  /**
   * get preview month
   */
  prevMonth(): void {
    this.selectedMonth.subtract(1, 'months');
    this.generateCalendarOfMonth();
  }

  /**
   * get next month
   */
  nextMonth(): void {
    this.selectedMonth.add(1, 'months');
    this.generateCalendarOfMonth();
  }

  /**
   * has task in next month
   */
  hasTaskInNextMonth(): boolean {
    return this.lastRemind.isAfter(this.selectedMonth, 'month');
  }

  /**
   * go reminds to the date
   *
   *
   * @param date
   */
  public goReminds(date: moment.Moment): Remind[] {
    const reminds: Remind[] = [];
    for (let i = 0; i < this.reminds.length; i++) {
      const remind = this.reminds[i];
      // TODO: use map(key, value) ?
      if (remind.date.isSame(moment(date), 'day')) {
        reminds.push(remind);
      }
    }

    return reminds;
  }

  /**
   * is date is today?
   * @param date - calendar date
   * @returns - true, if date is today
   */
  isToday(date: moment.Moment): boolean {
    return moment(date).isSame(moment(), 'day');
  }

  /**
   * is the day of this month?
   * @param month - month
   * @param date - date
   */
  isDayOfThisMonth(month: Month, day: CalendarDate): boolean {
    return moment(month.firstDay).isSame(day.mDate, 'month');
  }

  /**
   * is date in future?
   * @param date - calendar date
   * @returns - true, if date in future
   */
  isInFuture(date: moment.Moment): boolean {
    return moment().isBefore(moment(date), 'day');
  }

  /**
   * is the date off weekend?
   * @param date - calendar date
   * @returns - true, if date of weekend
   */
  isWeekend(date: CalendarDate): boolean {
    const day = date.mDate.isoWeekday();
    return day === 6 || day === 7;
  }

  /**
   * has day reminds?
   * @param date - calendar date
   * @returns - true, if date has reminds
   */
  hasReminds(date: CalendarDate): boolean {
    return date.reminds.length > 0;
  }

  isDateInWeek(week: CalendarDate[], date: CalendarDate) {
    return (
      week.filter(function (e) {
        return e === date;
      }).length > 0
    );
  }

  selectDate(date: CalendarDate) {
    if (this.hasReminds(date)) {
      if (date === this.selectedDate || !this.remindsVisible) {
        // invert visible reminds
        this.remindsVisible = !this.remindsVisible;
      }
      // set selected date
      this.selectedDate = date;
    } else {
      // clicked date has no reminds
      this.selectedDate = null;
    }
  }

  isRemindsInWeek(week: CalendarDate[]): boolean {
    return (
      this.selectedDate &&
      this.hasReminds(this.selectedDate) &&
      this.isDateInWeek(week, this.selectedDate)
    );
  }

  /**
   * set remind for task done
   */
  doneRemind(remind: Remind) {
    this.http
      .post<any>(`${environment.apiUrl}/task/done`, { id: remind.id })
      .pipe(first())
      .subscribe(
        (data) => {
          const response = data;
          // TODO: data.error ?
          if (response.done) {
            this.removeRemind(remind);
          }
        },
        (error) => {
          this.translate
            .get('toast.error.response')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  private removeRemind(remindToRemove: Remind) {
    this.selectedDate.reminds = reject(this.selectedDate.reminds, function (
      remind: Remind
    ) {
      return remind.id === remindToRemove.id;
    });
  }

  /**
   * ... is remind cached, than open in the list
   * TODO: refactoring?
   */
  goTasksList(remind: Remind) {
    this.objectsService.debtor = this.fakeDebtor(
      remind.debtor_id,
      remind.debtor_company
    );

    this.objectsService.task = this.fakeTask(remind.id);

    this.router.navigate(['/debtor/tasks']);
  }

  private fakeTask(id: number): Task {
    return {
      id: id,
      date: null,
      note: '',
    };
  }

  /**
   * @returns fake Debtor with only id & company name
   */
  private fakeDebtor(id: number, company: string): Debtor {
    return {
      id: id,
      created_by: 0,
      company: company,
      reg_number: '',
      debt: 0,
      legal_address: '',
      city: '',
      postal_code: '',
      country: '',
      phone: '',
      fax: '',
      email: '',
      homepage: '',
      bank_name: '',
      bank_account_number: '',
      status: null,
      note: '',
      // created_at: null,
      // updated_at: null,
      // deleted_at: null,
    };
  }
}
