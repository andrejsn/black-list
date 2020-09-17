import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { ContractTableElement, Document } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

interface DocumentTableElement extends Document {
  toDelete: boolean;
  visible: boolean;
}
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  animations: [inOutAnimation()],
})
export class DocumentsComponent implements OnInit {
  @Input() contract: ContractTableElement;
  documentsList: DocumentTableElement[] = [];
  visibleList: boolean;

  loading: boolean;

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // TODO: schould list visible
    // if -> yes reset another -> see guarantors coponent

    // get Data 
    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/contract/` +
          this.contract.id +
          `/documents`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          const tmp = data as DocumentTableElement[];
          this.documentsList = tmp;
        },
        (error) => {
          console.log(error);
        }
      );
  }

}
