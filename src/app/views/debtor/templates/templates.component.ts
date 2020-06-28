import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '@app/models';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplateComponent implements OnInit {

  @Input() contract: Contract;

  constructor() { }

  ngOnInit(): void {console.log(this.contract.number);
  }

}
