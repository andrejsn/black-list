import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Contract } from '@app/models';

@Component({
  selector: 'app-reminder-pay',
  templateUrl: './reminder-pay.component.html',
  styleUrls: ['./reminder-pay.component.css']
})
export class ReminderPayComponent implements OnInit {

  @Input() contract: Contract;

  submitted: boolean = false;
  loading: boolean = false;



  form = new FormGroup({
    date: new FormControl(new Date()),
  });

  constructor() { }

  ngOnInit(): void {

    console.log(this.contract);


  }

}
