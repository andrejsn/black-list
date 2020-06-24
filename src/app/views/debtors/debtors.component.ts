import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { first } from 'rxjs/operators';
import { Debtor } from '@app/models';


interface DebtorTableElement extends Debtor {
  visible: boolean;
}

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.css']
})
export class DebtorsComponent implements OnInit {

  debtorsList: DebtorTableElement[];
  showTable: boolean;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/get/debtors`,
      {}
    ).pipe(first())
      .subscribe(
        data => {
          this.debtorsList = data;
          console.log(this.debtorsList);

        },
        error => {
          console.log(error);

        }
      );
  }

  toggle(debtorsList: DebtorTableElement[], index: number) {
    for (let i = 0; i < debtorsList.length; i++) {
      const debtor = debtorsList[i];
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
