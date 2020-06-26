import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DebtorComponent } from './debtor/debtor.component';

import { TranslateModule } from '@ngx-translate/core';
import { AddRoutingModule } from './add-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { NgxCurrencyModule } from "ngx-currency";
import { customCurrencyMaskConfig } from '@app/app.module';
import { EnumToArrayPipe } from '@shared/helpers';

@NgModule({
  declarations: [DebtorComponent, EnumToArrayPipe],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    //NgxEditorModule,
    AddRoutingModule,
    TranslateModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),

  ]
})
export class AddModule { }
