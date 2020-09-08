import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { Contract, Invoice, InvoiceStatus } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

interface InvoiceTableElement extends Invoice {
  toDelete: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  animations: [inOutAnimation()],
})
export class InvoicesComponent implements OnInit {
  @Input() contract: Contract;
  invoicesList: InvoiceTableElement[] = [];
  visibleList: boolean = false;

  // selectedInvoice: InvoiceTableElement;

  loading: boolean;

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // should be list visible?
    if (this.objectsService.invoice) {
      // this.selectedInvoice = this.objectsService.invoice as InvoiceTableElement;
      this.visibleList = true;
      // reset another
      this.objectsService.representative = null;
      this.objectsService.guarantor = null;
    }

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

  isClosed(invoice: InvoiceTableElement): boolean {
    return (
      invoice.status.toString() ===
      InvoiceStatus[InvoiceStatus.closed].toString()
    );
  }

  editInvoice(selectedInvoice: InvoiceTableElement) {
    this.objectsService.invoice = selectedInvoice;
    this.router.navigate(['/edit/invoice']);
  }

  /**
   * delete invoice
   * @param invoiceToDelete - invoice
   */
  notifyDeleteInvoice(invoiceToDelete: InvoiceTableElement) {
    this.loading = true;
    invoiceToDelete.toDelete = true;

    this.snotifyService
      .confirm('The invoice will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes',
            action: () => this.deleteInvoice(invoiceToDelete),
            bold: false,
          },
          {
            text: 'No',
            action: () => this.cancelDeleteInvoice(invoiceToDelete),
          },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeleteInvoice(invoiceToDelete);
      });
  }

  private cancelDeleteInvoice(invoiceToDelete: InvoiceTableElement) {
    this.loading = false;
    invoiceToDelete.toDelete = false;
  }

  private deleteInvoice(invoiceToDelete: InvoiceTableElement) {
    this.http
      .post<any>(`${environment.apiUrl}/invoice/destroy`, {
        id: invoiceToDelete.id,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          const response = data;
          // TODO: data.error ?
          if (response.deleted) {
            this.invoicesList = reject(this.invoicesList, function (
              invoice: InvoiceTableElement
            ) {
              return (invoice.id as number) === (response.deleted as number);
            });
          }
        },
        (error) => {
          this.loading = false;
          this.translate
            .get('toast.error.response')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
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
