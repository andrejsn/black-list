import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { first } from 'rxjs/operators';

import { Contract, Template } from '@app/models';
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

  toggle(templateList, i) {

  }
}
