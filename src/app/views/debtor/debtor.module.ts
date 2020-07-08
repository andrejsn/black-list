import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DebtorRoutingModule } from './debtor-routing.module';
import { DetailsComponent } from './details/details.component';
import { ContractsComponent, InvoicesComponent, RepresentativesComponent, GuarantorsComponent, DocumentsComponent } from '.';
import { TemplateComponent } from './templates/templates.component';

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
  ]
})
export class DebtorModule { }
