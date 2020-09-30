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
  ) { }

  ngOnInit(): void {
    // TODO: schould list visible
    // if -> yes reset another -> see guarantors coponent


    // get data
    this.http
      .get<any>(`${environment.apiUrl}/get/contract/`
        + this.contract.id
        + `/documents`,
        {}
      ).pipe(first())
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

  /**
  * toggle row
  */
  toggle(id: number) {
    this.documentsList.forEach((document) => {
      document.visible = document.id === id ? !document.visible : false;
    });
  }

  editDocument(selectedDocument: DocumentTableElement) {
    this.objectsService.document = selectedDocument;
    this.router.navigate(['/edit/document']);
  }

  /**
  * delete document
  * @param documentToDelete - document
  */
  notifyDeleteDocument(documentToDelete: DocumentTableElement) {
    this.loading = true;
    documentToDelete.toDelete = true;

    this.snotifyService.confirm('The document will be deleted', 'Are you sure?', {
      timeout: 5000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {
          text: 'Yes',
          action: () => this.deleteDocument(documentToDelete),
          bold: false
        }, {
          text: 'No',
          action: () => this.cancelDeleteDocument(documentToDelete)
        },
      ]
    }).on('beforeHide', (toast: Snotify) => {
      this.cancelDeleteDocument(documentToDelete);
    });
  }

  private deleteDocument(documentToDelete: DocumentTableElement) {
    this.http.post<any>(`${environment.apiUrl
      }/document/destroy`, { id: documentToDelete.id }).pipe(first()).subscribe((data) => {
        const response = data;
        // TODO: data.error ?
        if (response.deleted) {
          this.documentsList = reject(this.documentsList, function (document: DocumentTableElement) {
            return (document.id as number) === (response.deleted as number);
          });
        }
      }, (error) => {
        this.loading = false;
        this.translate.get('toast.error.response').subscribe((err: string) => {
          this.snotifyService.error(error);
        });
      });
  }

  private cancelDeleteDocument(documentToDelete: DocumentTableElement) {
    documentToDelete.toDelete = false;
  }
}
