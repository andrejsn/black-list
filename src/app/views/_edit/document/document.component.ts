import { HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { Debtor, Contract, Document } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  selectedDebtor: Debtor;
  selectedContract: Contract;
  selectedDocument: Document;

  editDocumentForm = new FormGroup({
    byname: new FormControl(),
  });

  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private translate: TranslateService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    if (
      !this.objectsService.debtor &&
      !this.objectsService.contract &&
      !this.objectsService.document) { // no debtor&contract&document cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;
    this.selectedContract = this.objectsService.contract;
    this.selectedDocument = this.objectsService.document;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- add document');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      {
        route: '/',
        name: 'Home',
        active: false
      },
      {
        route: '/debtors',
        name: 'Debtors',
        active: false
      },
      {
        route: '/debtor',
        name: 'Debtor: ' + this.selectedDebtor.company,
        active: false
      },
      {
        route: '/contract',
        name: 'Contract: ' + this.selectedContract.number,
        active: true
      }, {
        route: '/edit/document',
        name: 'Edit document',
        active: true
      },
    ]);

    // create validation
    this.editDocumentForm = this.formBuilder.group({
      byname: [this.selectedDocument.byname, [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
    });

  }

  /**
  * submit form
  */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editDocumentForm.invalid) {
      this.translate.get('toast.error.template.form').subscribe((error: string) => {
        this.snotifyService.error(error);
      });

      return;
    }

    this.loading = true;
    this.http
      .post<any>(`${environment.apiUrl}/document/update`, {
        id: this.selectedDocument.id,
        byname: this.f['byname'].value
      })
      .pipe(first())
      .subscribe(
        (data) => {
          this.objectsService.document.byname = this.f['byname'].value;
          this.router.navigate(['/debtor/contracts']);
        },
        (error) => {
          this.loading = false;
          this.submitted = false;
          this.objectsService.guarantor = null;
          this.translate
            .get('toast.error.response')
            .subscribe((error: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editDocumentForm.controls;
  }
}
