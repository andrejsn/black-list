import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Debtor, Contract } from '@app/models';

interface ContractTableElement extends Contract {
  visible: boolean;
}

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  @Input() debtor: Debtor;
  contractsList: ContractTableElement[];
  count: number;
  isTemplateCollapsed: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    if(!this.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    // get data
    this.http.get<any>(`${environment.apiUrl}/get/debtor/` + this.debtor.id + `/contracts`,
      {}
    ).pipe(first())
      .subscribe(
        data => {
          this.contractsList = data;
          this.count = this.contractsList.length;

          this.isTemplateCollapsed = true;
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



  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

}
