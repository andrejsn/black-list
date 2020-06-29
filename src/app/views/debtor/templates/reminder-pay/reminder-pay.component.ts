import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '@app/models';

@Component({
  selector: 'app-reminder-pay',
  templateUrl: './reminder-pay.component.html',
  styleUrls: ['./reminder-pay.component.css']
})
export class ReminderPayComponent implements OnInit {

  @Input() contract: Contract;

  constructor() { }

  ngOnInit(): void {

    console.log(this.contract);


  }

}
