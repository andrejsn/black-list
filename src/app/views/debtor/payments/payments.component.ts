import { Component, OnInit, Input } from '@angular/core';
import { Payment } from '@app/models';

interface PaymentTableElement extends Payment {
  mode: 'edit' | 'save';
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  @Input() payments: PaymentTableElement[];


  constructor() { }

  ngOnInit(): void {
    this.payments.forEach(payment => {
      payment.mode = "edit";
    });

    // console.log(this.payments);

  }

  changeMode(payment: PaymentTableElement) {
    if (payment.mode === "edit") {
      payment.mode = "save";
    } else {
      payment.mode = "edit";
    }
  }
}
