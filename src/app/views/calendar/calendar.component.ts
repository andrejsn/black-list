import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';

import { Calendar, CalendarStatus } from '@app/models';
import { environment } from '@environments/environment';

import * as moment from 'moment';
import * as range from 'lodash.range';
import { first } from 'rxjs/operators';

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
  // status: CalendarStatus;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  selectedMonth: moment.Moment;
  calendarMonth: Month = { firstDay: null, weeks: [] };

  public months: Month[] = [];
  // public namesOfDays: string[] = [];
  public reminds: Remind[] = [];

  constructor(private eRef: ElementRef, private http: HttpClient) {}

  ngOnInit(): void {
    moment.locale('lv');
    this.selectedMonth = moment();

    // this.namesOfDays = moment.weekdaysShort();
    // this.namesOfDays.push(
    //   /*set monday as week start*/ this.namesOfDays.shift()
    // );

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
              // status: date.remind_status,
            };
          });

          // this.generateCalendarOfYear();
          this.generateCalendarOfMonth();

          this.reminds.forEach((remind) => {
            console.log(
              remind.date.format('DD-MM-YYYY') +
                ' -> ' +
                // remind.status +
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

  // /**
  //  * generate full calendar
  //  * @param year -  current year
  //  */
  // generateCalendarOfYear() {
  //   // clear months
  //   this.months = [];
  //   // create for 12 months
  //   for (let i = 0; i < 12; i++) {
  //     const firstDay = moment([this.selectedYear, i, 1]);
  //     const dates = this.fillDates(firstDay);

  //     const weeks = [];
  //     while (dates.length > 0) {
  //       weeks.push(dates.splice(0, 7));
  //     }

  //     this.months.push({ firstDay: firstDay, weeks: weeks });
  //   }
  // }

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

  // /**
  //  * get preview year
  //  */
  // public prevYear(): void {
  //   this.selectedYear--;
  //   this.generateCalendarOfYear();
  // }

  // /**
  //  * get next year
  //  */
  // public nextYear(): void {
  //   this.selectedYear++;
  //   this.generateCalendarOfYear();
  // }

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
   * @returns - true if date is today
   */
  isToday(date: moment.Moment): boolean {
    return moment(date).isSame(moment(), 'day');
  }

  /**
   * is the day of this month?
   * @param month - month
   * @param date - date
   */
  public isDayOfThisMonth(month: Month, day: CalendarDate): boolean {
    return moment(month.firstDay).isSame(day.mDate, 'month');
  }

  /**
   * is the day off weekend?
   */
  public isWeekend(date: CalendarDate): boolean {
    const day = date.mDate.isoWeekday();
    return (day === 6 || day === 7);
  }

  public selectDate(date: CalendarDate) {
    // this.selectedDate = moment(date.mDate).format('DD/MM/YYYY');

    // this.generateCalendar();
    // this.show = !this.show;

    console.log(moment(date.mDate).format('DD/MM/YYYY'));
  }

  // SWITCH SCSS FUNKTIONS
  /****************************************************** */
  // private isOnlyOneRemind(month: Month, day: CalendarDate): boolean {
  //   return this.isDayOfThisMonth(month, day.mDate) && day.reminds.length === 1;
  // }

  // isImportant(month: Month, day: CalendarDate): boolean {
  //   return (
  //     this.isOnlyOneRemind(month, day) &&
  //     day.reminds[0].status.toString() === 'important' &&
  //     day.reminds[0].done === '0'
  //   );
  // }

  // isImportantDone(month: Month, day: CalendarDate): boolean {
  //   return (
  //     this.isOnlyOneRemind(month, day) &&
  //     day.reminds[0].status.toString() === 'important' &&
  //     day.reminds[0].done === '1'
  //   );
  // }

  // isUnImportant(month: Month, day: CalendarDate): boolean {
  //   return (
  //     this.isOnlyOneRemind(month, day) &&
  //     day.reminds[0].status.toString() === 'unimportant' &&
  //     day.reminds[0].done === '0'
  //   );
  // }

  // isUnImportantDone(month: Month, day: CalendarDate): boolean {
  //   return (
  //     this.isOnlyOneRemind(month, day) &&
  //     day.reminds[0].done === '1' &&
  //     day.reminds[0].status.toString() === 'unimportant'
  //   );
  // }

  // isRegular(month: Month, day: CalendarDate): boolean {
  //   return (
  //     this.isOnlyOneRemind(month, day) &&
  //     day.reminds[0].status.toString() === 'regular' &&
  //     day.reminds[0].done === '0'
  //   );
  // }

  // isRegularDone(month: Month, day: CalendarDate): boolean {
  //   return (
  //     this.isOnlyOneRemind(month, day) &&
  //     day.reminds[0].status.toString() === 'regular' &&
  //     day.reminds[0].done === '1'
  //   );
  // }

  // isMixed(month: Month, day: CalendarDate): boolean {
  //   if (this.isDayOfThisMonth(month, day.mDate) && day.reminds.length > 1) {
  //     for (let i = 0; i < day.reminds.length; i++) {
  //       const remind = day.reminds[i];
  //       if (remind.done === '0') {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  // isMixedAllDone(month: Month, day: CalendarDate): boolean {
  //   if (this.isDayOfThisMonth(month, day.mDate) && day.reminds.length > 1) {
  //     for (let i = 0; i < day.reminds.length; i++) {
  //       const remind = day.reminds[i];
  //       if (remind.done !== '1') {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
  //   return false;
  // }
}
