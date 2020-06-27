import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { first } from 'rxjs/operators';

import { Contract, Representative } from '@app/models';
import { environment } from '@environments/environment';

interface RepresentativeTableElement extends Representative {
  visible: boolean;
}

@Component({
  selector: 'app-representatives',
  templateUrl: './representatives.component.html',
  styleUrls: ['./representatives.component.css']
})
export class RepresentativesComponent implements OnInit {

  @Input() contract: Contract;
  representativesTableElement: RepresentativeTableElement[];
  count: number;

  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
    // get data
    this.http.get<any>(`${environment.apiUrl}/get/contract/` + this.contract.id + `/representatives`,
      {}
    ).pipe(first())
      .subscribe(
        data => {

          this.representativesTableElement = data;
          this.count = this.representativesTableElement.length;
          console.log(this.representativesTableElement);
        },
        error => {
          console.log(error);

        }
      );
  }

  toggle (representativeList: RepresentativeTableElement[], index:number){
    for (let i = 0; i < representativeList.length; i++) {
      const debtor = representativeList[i];
      let selector = `.row-num-${i}-representative`;

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
