import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { first } from 'rxjs/operators';

import { Contract, Guarantor } from '@app/models';
import { environment } from '@environments/environment';

interface GuarantorTableElement extends Guarantor {
  visible: boolean;
}

@Component({
  selector: 'app-guarantors',
  templateUrl: './guarantors.component.html',
  styleUrls: ['./guarantors.component.css']
})
export class GuarantorsComponent implements OnInit {

  @Input() contract: Contract;
  guarantorsList: GuarantorTableElement[];
  count: number;

  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
    // get data
    this.http.get<any>(`${environment.apiUrl}/get/contract/` + this.contract.id + `/guarantors`,
      {}
    ).pipe(first())
      .subscribe(
        data => {

          this.guarantorsList = data;
          this.count = this.guarantorsList.length;
          // console.log(this.guarantorsList);
        },
        error => {
          console.log(error);

        }
      );
  }

  toggle (guarantorsList: GuarantorTableElement[], index:number){
    for (let i = 0; i < guarantorsList.length; i++) {
      const debtor = guarantorsList[i];
      let selector = `.row-num-${i}-guarantor`;

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
