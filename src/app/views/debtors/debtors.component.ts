import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { first } from 'rxjs/operators';
import { Debtor } from '@app/models';

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.css']
})
export class DebtorsComponent implements OnInit {

  debtors: Debtor[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/get/debtors`,
{}
    ).pipe(first())
      .subscribe(
        data => {
          this.debtors = data;
          console.log(this.debtors);

        },
        error => {
          console.log(error);

        }
      );
  }

}
