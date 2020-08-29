import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { P404Component } from '../error/404.component';
import {
  RepresentativeComponent,
  DebtorComponent,
  TaskComponent,
  GuarantorComponent,
} from '.';

const routes: Routes = [
  {
    path: 'debtor',
    component: DebtorComponent,
  },
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
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoutingModule {}
