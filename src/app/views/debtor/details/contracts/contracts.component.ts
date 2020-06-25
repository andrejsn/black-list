import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { DebtorCachedService } from '@shared/services';
import { Contract } from '@app/models/contract';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  contracts: Contract[];

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
          this.contracts = data;
          console.log(this.contracts);

        },
        error => {
          console.log(error);

        }
      );
  }

}
