import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '@app/models';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  @Input() contract: Contract;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.contract.number);
  }

}
