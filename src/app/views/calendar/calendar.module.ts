import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';


@NgModule({
  declarations: [CalendarComponent],
  imports: [
    FormsModule,
    CommonModule,
    CalendarRoutingModule
  ]
})
export class CalendarModule { }
