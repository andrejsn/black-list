import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { environment } from '@environments/environment';
import { Debtor, Contract, ContractTableElement } from '@app/models';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements OnInit {
  selectedDebtor: Debtor;
  selectedContract: Contract;
  contractsList: ContractTableElement[];
  count: number;

  loading: boolean;

  constructor(
    private objectsService: ObjectsService,
    private title: Title,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    if (!this.objectsService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;

    if (this.objectsService.contract) {
      this.selectedContract = this.objectsService.contract;
    }

    this.objectsService.invoice = null;
    this.objectsService.representative = null;
    this.objectsService.guarantor = null;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- contracts list');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: false },
      {
        route: '/debtor',
        name: 'Debtor: ' + this.selectedDebtor.company,
        active: false,
      },
      { route: '/debtor/contracts', name: 'Contracts', active: true },
    ]);

    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/debtor/` +
          this.selectedDebtor.id +
          `/contracts`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          const tmp = data as Contract[];
          this.contractsList = tmp.map((contract: Contract) => {
            return {
              id: contract.id,
              with_agreement: contract.with_agreement,
              number: contract.number,
              date: contract.date,
              fine_per_day: contract.fine_per_day,
              fine_per_year: contract.fine_per_year,
              type_of_fine: contract.type_of_fine,
              max_fine_percent: contract.max_fine_percent,
              pay_term_days: contract.pay_term_days,
              note: contract.note,
              toDelete: false,
              visible: this.isContractVisible(contract),
            };
          });

          this.count = this.contractsList.length;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private isContractVisible(contract: Contract): boolean {
    return this.selectedContract && this.selectedContract.id === contract.id;
  }

  /**
   * toggle row
   */
  toggle(id: number) {
    this.contractsList.forEach((contract) => {
      if (contract.id === id) {
        contract.visible = !contract.visible;
        if (contract.visible) {
          this.objectsService.contract = contract;
        }
      } else {
        contract.visible = false;
      }
    });
  }

  /**
   * delete contract
   * @param contractToDelete - delete
   */
  notifyDeleteContract(contractToDelete: ContractTableElement) {
    this.loading = true;
    contractToDelete.toDelete = true;

    this.snotifyService
      .confirm('The contract will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes',
            action: () => this.deleteContract(contractToDelete),
            bold: false,
          },
          {
            text: 'No',
            action: () => this.cancelDeleteContract(contractToDelete),
          },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeleteContract(contractToDelete);
      });
  }

  private cancelDeleteContract(contractToDelete: ContractTableElement) {
    this.loading = false;
    contractToDelete.toDelete = false;
  }

  private deleteContract(contractToDelete: ContractTableElement) {
    this.http
      .post<any>(`${environment.apiUrl}/contract/destroy`, {
        id: contractToDelete.id,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          const response = data;
          // TODO: data.error ?
          if (response.deleted) {
            this.contractsList = reject(this.contractsList, function (
              contract: ContractTableElement
            ) {
              return (contract.id as number) === (response.deleted as number);
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
}
