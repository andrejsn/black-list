import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { first } from 'rxjs/operators';

import { Contract, Invoice } from '@app/models';
import { environment } from '@environments/environment';

interface InvoiceTableElement extends Invoice {
  visible: boolean;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  @Input() contract: Contract;
  invoicesList: InvoiceTableElement[];
  count: number;

  constructor(private http: HttpClient, ) { }

  ngOnInit(): void {

    console.log(this.contract.number);

    // get data
    this.http.get<any>(`${environment.apiUrl}/get/contract/` + this.contract.id + `/invoices`,
      {}
    ).pipe(first())
      .subscribe(
        data => {

          this.invoicesList = data;
          this.count = this.invoicesList.length;
          console.log(this.invoicesList);
        },
        error => {
          console.log(error);

        }
      );
  }

  toggle (invoiceList: InvoiceTableElement[], index:number){
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