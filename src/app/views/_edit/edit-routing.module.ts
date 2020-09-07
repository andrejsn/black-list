import { InvoiceComponent } from './invoice/invoice.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskComponent, RepresentativeComponent, GuarantorComponent, ContractComponent } from '.';
import { P404Component } from '../error/404.component';

const routes: Routes = [
  // {
  //   path: 'debtor',
  //   component: DebtorComponent,
  //   data: {
  //     title: 'Add Debtor',
  //   },
  // },
  {
    path: 'task',
    component: TaskComponent,
  },
  {
    path: 'representative',
    component: RepresentativeComponent,
  },
  {
    path: 'guarantor',
    component: GuarantorComponent,
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
  },
  {
    path: 'contract',
    component: ContractComponent,
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
