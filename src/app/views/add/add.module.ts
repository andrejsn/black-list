import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DebtorComponent } from './debtor/debtor.component';

import { TranslateModule} from '@ngx-translate/core';
import { AddRoutingModule } from './add-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { NgxCurrencyModule } from "ngx-currency";
import { customCurrencyMaskConfig } from '@app/app.module';

@NgModule({
  declarations: [DebtorComponent],
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
