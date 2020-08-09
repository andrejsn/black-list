import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Debtor, Contract } from '@app/models';
import { DebtorCachedService } from '@shared/services';

interface ContractTableElement extends Contract {
  visible: boolean;
}

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements OnInit {
  debtor: Debtor;
  contractsList: ContractTableElement[];
  count: number;

  constructor(
    private router: Router,
    private http: HttpClient,
    private debtorCachedService: DebtorCachedService
  ) {}

  ngOnInit(): void {
    if (!this.debtorCachedService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    this.debtor = this.debtorCachedService.debtor;

    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/debtor/` + this.debtor.id + `/contracts`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.contractsList = data;
          this.count = this.contractsList.length;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * toggle row
   */
  toggle(contractsList: ContractTableElement[], index: number) {
    for (let i = 0; i < contractsList.length; i++) {
      const debtor = contractsList[i];
      const selector = `.row-num-${i}`;

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
