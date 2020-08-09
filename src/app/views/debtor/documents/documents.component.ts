import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '@app/models';
import { inOutAnimation } from '@shared/helpers';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  animations: [inOutAnimation()],
})
export class DocumentsComponent implements OnInit {

  @Input() contract: Contract;
  visible: boolean;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.contract.number);
  }

}
