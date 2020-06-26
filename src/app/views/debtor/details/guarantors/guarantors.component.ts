import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '@app/models';

@Component({
  selector: 'app-guarantors',
  templateUrl: './guarantors.component.html',
  styleUrls: ['./guarantors.component.css']
})
export class GuarantorsComponent implements OnInit {

  @Input() contract: Contract;

  constructor() { }

  ngOnInit(): void {console.log(this.contract.number);
  }

}
