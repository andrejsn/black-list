import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DebtorRoutingModule } from './debtor-routing.module';
import { DetailsComponent } from './details/details.component';
import { TemplateComponent } from './templates/templates.component';
import {
  TasksComponent,
  ContractsComponent,
  InvoicesComponent,
  RepresentativesComponent,
  GuarantorsComponent,
  DocumentsComponent,
  PaymentsComponent,
  AddPaymentComponent,
} from '.';

import { ShortenTextPipe } from '@shared/helpers';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ReminderPayComponent } from './templates/reminder-pay/reminder-pay.component';
import { WarningPayComponent } from './templates/warning-pay/warning-pay.component';
import { DebtCalculationComponent } from './templates/debt-calculation/debt-calculation.component';
import { WarningPreTrialComponent } from './templates/warning-pre-trial/warning-pre-trial.component';
import { ClaimToCourtComponent } from './templates/claim-to-court/claim-to-court.component';
import { CreditorToAdministratorComponent } from './templates/creditor-to-administrator/creditor-to-administrator.component';
import { SharingModule } from '@shared/shareModule';

import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from '@app/app.module';

@NgModule({
  declarations: [
    DetailsComponent,
    ContractsComponent,
    InvoicesComponent,
    RepresentativesComponent,
    GuarantorsComponent,
    DocumentsComponent,
    TemplateComponent,

    ShortenTextPipe,

    ReminderPayComponent,
    WarningPayComponent,
    DebtCalculationComponent,
    WarningPreTrialComponent,
    ClaimToCourtComponent,
    CreditorToAdministratorComponent,
    PaymentsComponent,
    AddPaymentComponent,
    TasksComponent,
  ],
  imports: [
    CommonModule,
    SharingModule,
    FormsModule,
    ReactiveFormsModule,
    DebtorRoutingModule,
    CollapseModule,
    BsDatepickerModule,
    TranslateModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class DebtorModule {}
