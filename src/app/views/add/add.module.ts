import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AddRoutingModule } from './add-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { DebtorComponent } from './debtor/debtor.component';
import { HttpLoaderFactory } from '@app/app.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [DebtorComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    //NgxEditorModule,
    AddRoutingModule,
    TranslateModule
    //TranslateModule.forRoot({ defaultLanguage: 'en', loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] } }),
  ]
})
export class AddModule { }
