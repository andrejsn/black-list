import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditRoutingModule } from './edit-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from '@app/app.module';
import { SharingModule } from '@shared/shareModule';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import {
  ContractComponent,
  DebtComponent,
  DocumentComponent,
  GuarantorComponent,
  InvoiceComponent,
  RepresentativeComponent,
  TaskComponent,
} from '.';



@NgModule({
  declarations: [
    ContractComponent,
    DebtComponent,
    DocumentComponent,
    GuarantorComponent,
    InvoiceComponent,
    RepresentativeComponent,
    TaskComponent,
  ],
  imports: [
    CommonModule,
    EditRoutingModule,
    //
    SharingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BsDatepickerModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class EditModule {}
