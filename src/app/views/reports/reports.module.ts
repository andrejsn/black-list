import { NgModule } from '@angular/core';

import { ReportsComponent } from './reports.component';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReportsRoutingModule } from './reports-routing.module';


@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
