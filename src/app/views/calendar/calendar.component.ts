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
  public currentDate: moment.Moment;

  public months: Month[] = [];
  // public namesOfMonths = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December',
  // ];
  // public namesOfDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // public namesOfDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  public namesOfDays: string[] = [];

  public selectedDate;

  @ViewChild('calendar', { static: true }) calendar;

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      // this.show = false;
      console.log('hello+++');
    }
  }

  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {
    moment.locale('lv');
    this.namesOfDays = moment.weekdaysShort();
    this.namesOfDays.push(
      /*set monday as week start*/ this.namesOfDays.shift()
    );

    // moment.updateLocale('en', {
    //   week: {
    //     dow: 1, // First day of week is Monday
    //     // doy: 7, // First week of year must contain 1 January (7 + 1 - 1)
    //   },
    // });

    // this.currentDate = moment();
    // this.selectedDate = moment(this.currentDate).format('DD/MM/YYYY');
    // this.generateCalendar();

    // create months for current year
    for (let i = 0; i < 12; i++) {
      const firstDay = moment([2020, i, 1]);
      const dates = this.fillDates(firstDay);

      const weeks = [];
      while (dates.length > 0) {
        weeks.push(dates.splice(0, 7));
      }
      // console.log(weeks);
      this.months.push({ firstDay: firstDay, weeks: weeks });
    }
  }

  private generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    // this.weeks = weeks;
  }

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
    console.log('get to preview year');
  }

  public nextYear(): void {
    console.log('get to next year');
  }

  public prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  public nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  public isDisabledMonth(currentDate): boolean {
    const today = moment();
    return moment(currentDate).isBefore(today, 'months');
  }

  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  private isSelected(date: moment.Moment): boolean {
    return this.selectedDate === moment(date).format('DD/MM/YYYY');
  }

  public isSelectedMonth(date: moment.Moment): boolean {
    const today = moment();
    return (
      moment(date).isSame(this.currentDate, 'month') &&
      moment(date).isSameOrBefore(today)
    );
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
