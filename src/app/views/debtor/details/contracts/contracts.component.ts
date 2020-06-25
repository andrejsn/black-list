import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { first } from 'rxjs/operators';
import { DebtorCachedService } from '@shared/services';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  constructor(
    private debtorCachedService: DebtorCachedService,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    // get data
    this.http.get<any>(`${environment.apiUrl}/get/debtor/` + this.debtorCachedService.debtor.id + `/contracts`,
      {}
    ).pipe(first())
      .subscribe(
        data => {

          console.log(data);

        },
        error => {
          console.log(error);

        }
      );
  }

}
