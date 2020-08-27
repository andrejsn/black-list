import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DebtorComponent,
  ContractsComponent,
  DetailsComponent,
  TasksComponent,
} from '.';

const routes: Routes = [
  {
    path: '',
    component: DebtorComponent,
  },
  {
    path: 'contracts',
    component: ContractsComponent,
  },
  {
    path: 'details',
    component: DetailsComponent,
  },
  {
    path: 'tasks',
    component: TasksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebtorRoutingModule {}
