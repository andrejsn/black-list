import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';

import * as moment from 'moment';
import * as range from 'lodash.range';
import { first } from 'rxjs/operators';

import { Calendar, CalendarStatus } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';

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
  debtor_id: number;
  date: moment.Moment;
  done: string;
  note: string;
  type: string;
  // status: CalendarStatus;
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

  months: Month[] = [];
  public namesOfDays: string[] = [];
  reminds: Remind[] = [];

  constructor(private eRef: ElementRef, private http: HttpClient) {}

  ngOnInit(): void {
    this.remindsVisible = false;
    this.selectedMonth = moment();

    moment.locale('lv'); // TODO: read locale from storage
    this.namesOfDays = moment.weekdays();
    this.namesOfDays.push(
      /*set monday as week start*/ this.namesOfDays.shift()
    );

    // get reminders
    this.http
      .get<any>(`${environment.apiUrl}/get/user/reminds`, {})
      .pipe(first())
      .subscribe(
        (data) => {
          const tmp = data as Calendar[];
          this.reminds = tmp.map((date) => {
            return {
              debtor_id: date.debtor_id,
              date: moment(date.remind_date, 'YYYY-MM-DD'),
              done: date.remind_done,
              note: date.remind_note,
              type: this.remindType(moment(date.remind_date, 'YYYY-MM-DD')),
              // status: date.remind_status,
            };
          });

          // this.generateCalendarOfYear();
          this.generateCalendarOfMonth();

          this.reminds.forEach((remind) => {
            console.log(
              remind.date.format('DD-MM-YYYY') +
                ' -> ' +
                remind.type +
                ' done? ' +
                remind.done
            );
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  remindType(date: moment.Moment): string {
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
  generateCalendarOfMonth() {
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
   * get preview month
   */
  public prevMonth(): void {
    this.selectedMonth.subtract(1, 'months');
    this.generateCalendarOfMonth();
  }

  /**
   * get next month
   */
  public nextMonth(): void {
    this.selectedMonth.add(1, 'months');
    this.generateCalendarOfMonth();
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
      console.log(this.selectedDate.mDate.format('DD/MM/YYYY'));
    } else {
      // clicked date has no reminds
      this.selectedDate = null;
    }
  }

  showReminds(week: CalendarDate[]): boolean {
    return (
      this.selectedDate &&
      this.hasReminds(this.selectedDate) &&
      this.isDateInWeek(week, this.selectedDate)
    );
  }
}
