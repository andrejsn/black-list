import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddRoutingModule } from './add-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from '@app/app.module';
import { SharingModule } from '@shared/shareModule';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import {
  DebtorComponent,
  TaskComponent,
  RepresentativeComponent,
  GuarantorComponent,
} from '.';

@NgModule({
  declarations: [
    DebtorComponent,
    TaskComponent,
    RepresentativeComponent,
    GuarantorComponent,
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    //
    SharingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BsDatepickerModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class AddModule {}
