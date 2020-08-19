import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { DebtorComponent, TaskComponent } from '.';

import { TranslateModule } from '@ngx-translate/core';
import { AddRoutingModule } from './add-routing.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from '@app/app.module';
import { SharingModule } from '@shared/shareModule';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [DebtorComponent, TaskComponent],
  imports: [
    CommonModule,
    SharingModule,
    FormsModule,
    ReactiveFormsModule,
    AddRoutingModule,
    TranslateModule,
    BsDatepickerModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class AddModule {}
