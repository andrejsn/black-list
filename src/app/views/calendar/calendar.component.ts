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
  remind?: Remind;
  today?: boolean;
}

interface Remind {
  debtor_id: number;
  date: moment.Moment;
  done: string;
  note: string;
  status: CalendarStatus;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  public selectedYear: number;
  public months: Month[] = [];
  public namesOfDays: string[] = [];
  public reminds: Remind[] = [];

  constructor(private eRef: ElementRef, private http: HttpClient) {}

  ngOnInit(): void {
    moment.locale('lv');
    this.selectedYear = moment().year();

    this.namesOfDays = moment.weekdaysShort();
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
              status: date.remind_status,
            };
          });
          this.generateCalendarOfYear();
          console.log(this.reminds);
        },
        (error) => {
          console.log(error);
        }
      );


  }

  /**
   * generate full calendar
   * @param year -  current year
   */
  generateCalendarOfYear() {
    // clear months
    this.months = [];
    // create for 12 months
    for (let i = 0; i < 12; i++) {
      const firstDay = moment([this.selectedYear, i, 1]);
      const dates = this.fillDates(firstDay);

      const weeks = [];
      while (dates.length > 0) {
        weeks.push(dates.splice(0, 7));
      }

      this.months.push({ firstDay: firstDay, weeks: weeks });
    }
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
        remind: this.goRemind(newDate),
        today: this.isToday(newDate),
      };
    });
  }

  public prevYear(): void {
    this.selectedYear--;
    this.generateCalendarOfYear();
  }

  public nextYear(): void {
    this.selectedYear++;
    this.generateCalendarOfYear();
  }

  public goRemind(date: moment.Moment): Remind {
    for (let i = 0; i < this.reminds.length; i++) {
      const remind = this.reminds[i];

      if (remind.date.isSame(moment(date), 'day')) {
        return remind;
      }
    }
    return null;
  }

  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  public isDayOfThisMonth(month: Month, date: moment.Moment) {
    return moment(month.firstDay).isSame(date, 'month');
  }

  public selectDate(date: CalendarDate) {
    // this.selectedDate = moment(date.mDate).format('DD/MM/YYYY');

    // this.generateCalendar();
    // this.show = !this.show;

    console.log(moment(date.mDate).format('DD/MM/YYYY'));
  }
}
