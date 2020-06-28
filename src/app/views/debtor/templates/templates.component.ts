import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { first } from 'rxjs/operators';

import { Contract, Template, TemplateStatus } from '@app/models';
import { environment } from '@environments/environment';


interface TemplateTableElement extends Template {
  visible: boolean;
}


@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplateComponent implements OnInit {

  @Input() contract: Contract;
  templateList: TemplateTableElement[];
  templateStatus: TemplateStatus;
  maxLetters = 128;

  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
    // get data
    this.http.get<any>(`${environment.apiUrl}/get/contract/` + this.contract.id + `/templates`,
      {}
    ).pipe(first())
      .subscribe(
        data => {

          this.templateList = data;

          // console.log(this.templateList);
        },
        error => {
          console.log(error);

        }
      );
  }

  /**
   * Toggle row
   *
   * @param templatesList - list of html elements
   * @param index - from foreach of list
   */
  toggle(templatesList: TemplateTableElement[], index: number) {
    for (let i = 0; i < templatesList.length; i++) {
      const debtor = templatesList[i];
      const selector = `.row-num-${i}-template`;

      if (i === index) {
        document.querySelector(selector).classList.toggle('d-none');
        debtor.visible = !debtor.visible;
      } else {
        document.querySelector(selector).classList.add('d-none');
        debtor.visible = false;
      }
    }
  }

  /**
   *
   * Shorten or show long notes text
   *
   * @param index - from foreach of list
   */
  toggleNote(index: number) {
    const selectorShort = `.note-short-${index}`;
    const selectorLong = `.note-long-${index}`;

    document.querySelector(selectorShort).classList.toggle('d-none');
    document.querySelector(selectorLong).classList.toggle('d-none');
  }
}
