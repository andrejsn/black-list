import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertModule } from 'ngx-bootstrap/alert';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';


@NgModule({
  declarations: [CalendarComponent],
  imports: [
    FormsModule,
    CommonModule,
    AlertModule.forRoot(),
    CalendarRoutingModule
  ],
})
export class CalendarModule { }
