import { Component, OnInit, Input } from '@angular/core';
import { Payment } from '@app/models';


@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  @Input() payments: Payment;

  constructor() { }

  ngOnInit(): void {
  }

}
