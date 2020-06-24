import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { P404Component } from '../error/404.component';


const routes: Routes = [
  {
    path: '',
    component: P404Component
  },
  {
    path: 'details',
    component: DetailsComponent,
    data: {
      title: 'Debtor: Details'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtorRoutingModule { }
