import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '@app/models';

@Component({
  selector: 'app-representatives',
  templateUrl: './representatives.component.html',
  styleUrls: ['./representatives.component.css']
})
export class RepresentativesComponent implements OnInit {

  @Input() contract: Contract;

  constructor() { }

  ngOnInit(): void {
    console.log(this.contract.number);
  }

}
