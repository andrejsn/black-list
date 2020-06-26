import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { DebtorCachedService } from '@shared/services';
import { Contract } from '@app/models/contract';

interface ContractTableElement extends Contract {
  visible: boolean;
}

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  contractsList: ContractTableElement[];
  count: number;

  constructor(
    private debtorCachedService: DebtorCachedService,
    private router: Router,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    if(!this.debtorCachedService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    // get data
    this.http.get<any>(`${environment.apiUrl}/get/debtor/` + this.debtorCachedService.debtor.id + `/contracts`,
      {}
    ).pipe(first())
      .subscribe(
        data => {
          this.contractsList = data;
          this.count = this.contractsList.length;
          console.log(this.contractsList);

        },
        error => {
          console.log(error);

        }
      );
  }

  toggle (contractsList: ContractTableElement[], index:number){
    for (let i = 0; i < contractsList.length; i++) {
      const debtor = contractsList[i];
      let selector = `.row-num-${i}`;

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
