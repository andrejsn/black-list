import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '@app/models';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  @Input() contract: Contract;

  constructor() { }

  ngOnInit(): void {

    console.log(this.contract.number);


  }

}
