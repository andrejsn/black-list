import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Debtor, Contract } from '@app/models';
import { ObjectsService } from '@shared/services';

interface ContractTableElement extends Contract {
  visible: boolean;
}

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

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient
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
}
