import {ContractComponent} from './contract/contract.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {P404Component} from '../error/404.component';
import {
    RepresentativeComponent,
    DebtorComponent,
    TaskComponent,
    GuarantorComponent,
    DocumentComponent
} from '.';
import {InvoiceComponent} from './invoice/invoice.component';


const routes: Routes = [
    {
        path: 'debtor',
        component: DebtorComponent
    },
    {
        path: 'task',
        component: TaskComponent
    },
    {
        path: 'contract',
        component: ContractComponent
    },
    {
        path: 'invoice',
        component: InvoiceComponent
    }, {
        path: 'representative',
        component: RepresentativeComponent
    }, {
        path: 'guarantor',
        component: GuarantorComponent
    }, {
        path: 'document',
        component: DocumentComponent
    }, {
        path: '**',
        component: P404Component
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddRoutingModule {}
