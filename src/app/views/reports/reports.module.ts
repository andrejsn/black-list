import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from 'ngx-currency';

import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';

import { customCurrencyMaskConfig } from '@app/app.module';


@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ReportsRoutingModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ]
})
export class ReportsModule { }
