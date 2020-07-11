import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { first } from 'rxjs/operators';

import { Contract, Invoice } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';

interface InvoiceTableElement extends Invoice {
  visible: boolean;
}

enum ShowSubMenu {payments, add_payment, edit, delete}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
  animations: [inOutAnimation()],
})
export class InvoicesComponent implements OnInit {

  @Input() contract: Contract;
  invoicesList: InvoiceTableElement[];
  visible: boolean = false;
  count: number;

  showSubMenu: ShowSubMenu = ShowSubMenu.payments;


  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
    // get data
    this.http.get<any>(`${environment.apiUrl}/get/contract/` + this.contract.id + `/invoices`,
      {}
    ).pipe(first())
      .subscribe(
        data => {
          this.invoicesList = data;
          this.count = this.invoicesList.length;
          // console.log(this.invoicesList);
        },
        error => {
          console.log(error);

        }
      );
  }

  toggle(invoiceList: InvoiceTableElement[], index: number) {
    for (let i = 0; i < invoiceList.length; i++) {
      const debtor = invoiceList[i];
      let selector = `.row-num-${i}-invoice`;

      if (i === index) {
        document.querySelector(selector).classList.toggle('d-none');
        debtor.visible = !debtor.visible;
      } else {
        document.querySelector(selector).classList.add('d-none');
        debtor.visible = false;
      }
    }
  }

}
