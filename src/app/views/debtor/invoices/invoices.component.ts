import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { Contract, Guarantor, Invoice } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

interface InvoiceTableElement extends Invoice {
  visible: boolean;
}

enum ShowSubMenu {
  payments,
  add_payment,
  // edit,
  delete,
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  animations: [inOutAnimation()],
})
export class InvoicesComponent implements OnInit {
  @Input() contract: Contract;
  invoicesList: InvoiceTableElement[];
  visible: boolean = false;
  count: number;

  showSubMenu: ShowSubMenu = ShowSubMenu.payments;

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/contract/` + this.contract.id + `/invoices`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.invoicesList = data;
          this.count = this.invoicesList.length;
          // console.log(this.invoicesList);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   *
   */
  toggle(id: number) {
    this.invoicesList.forEach((invoice) => {
      invoice.visible = invoice.id === id ? !invoice.visible : false;
    });
  }

  editInvoice(selectedInvoice: InvoiceTableElement) {
    this.objectsService.invoice = selectedInvoice;
    this.router.navigate(['/edit/invoice']);
  }

  /**
   *
   */
  invoicesSum(): number {
    let sum: number = 0;
    this.invoicesList.forEach((invoice) => {
      sum += invoice.sum * 1;
    });

    return sum;
  }
}
