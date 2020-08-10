import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import * as range from 'lodash.range';

export interface Month {
  firstDay: moment.Moment;
  weeks: Array<CalendarDate[]>;
}

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
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

  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {
    moment.locale('lv');

    this.namesOfDays = moment.weekdaysShort();
    this.namesOfDays.push(
      /*set monday as week start*/ this.namesOfDays.shift()
    );

    this.selectedYear = moment().year();
    this.generateCalendarOfYear();
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
        today: this.isToday(newDate),
        selected: this.isSelected(newDate),
        mDate: newDate,
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

  public isSelected(date: moment.Moment) {
    return false;
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
