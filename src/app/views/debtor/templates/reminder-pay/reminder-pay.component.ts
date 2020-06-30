import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '@app/models';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reminder-pay',
  templateUrl: './reminder-pay.component.html',
  styleUrls: ['./reminder-pay.component.css']
})
export class ReminderPayComponent implements OnInit {

  @Input() contract: Contract;

  submitted:boolean = false;
  loading:boolean = false;

  currentDate = new Date();

  form = new FormGroup({
    dateYMD: new FormControl(new Date()),
    dateFull: new FormControl(new Date()),
    dateMDY: new FormControl(new Date()),
    dateRange: new FormControl([
      new Date(),
      new Date(this.currentDate.setDate(this.currentDate.getDate() + 7))
    ])
  });

  constructor() { }

  ngOnInit(): void {

    console.log(this.contract);


  }

}
