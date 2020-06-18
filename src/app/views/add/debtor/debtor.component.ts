import { Component, OnInit } from '@angular/core';
import { statuses } from '@app/models';

@Component({
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.css']
})
export class DebtorComponent implements OnInit {

  company: string;

  all_statuses:string[]  = statuses;

  constructor() { }

  ngOnInit(): void {

  }


  companyNameChanged(companyName:string) {
    console.log(companyName);

  }

  statusChanged(status) {
    console.log(status);


  }

}
