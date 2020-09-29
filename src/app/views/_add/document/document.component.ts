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

import { Debtor, Contract, Guarantor } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';
import { Observable } from 'rxjs';

@Component({ selector: 'app-document', templateUrl: './document.component.html', styleUrls: ['./document.component.css'] })
export class DocumentComponent implements OnInit {
  selectedDebtor: Debtor;
  selectedContract: Contract;

  selectedFiles: FileList;
  currentFile: File;
  progress = 0;

  fileInfos: Observable<any>;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  addDocumentForm = new FormGroup({
    documentName: new FormControl(),
    fileName: new FormControl(),
    file: new FormControl()
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
    if (!this.objectsService.debtor && !this.objectsService.contract) { // no debtor&contract cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;
    this.selectedContract = this.objectsService.contract;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- add guarantor');
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
        route: '/add/document',
        name: 'Add document',
        active: true
      },
    ]);

    // create validation
    this.addDocumentForm = this.formBuilder.group({
      documentName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      fileName: ['', [Validators.required]],
      file: ['', [Validators.required]],
    });
  }

  /**
  * submit form
  */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addDocumentForm.invalid) {
      this.translate.get('toast.error.template.form').subscribe((error: string) => {
        this.snotifyService.error(error);
      });

      return;
    }

    this.loading = true;
    this.uploadFile();
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
    this.f['fileName'].setValue(this.selectedFiles[0].name);
  }

  private uploadFile(): void {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);
    this.upload(this.currentFile).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          // File has been uploaded
          // console.log(event.body.success);

          this.snotifyService.success('File has been uploaded', 'Example title', {
            timeout: 2000,
            showProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true
          });

          this.router.navigate(['/debtor/contracts']);
        }
      },

      (error) => {
        this.loading = false;

        console.log(error.error);


        this.progress = 0;
        this.currentFile = undefined;
        this.loading = false;
        this.submitted = false;



        this.translate
          .get('toast.error.response')
          .subscribe((err: string) => {
            this.snotifyService.error(error);
          });
      }
    );
    this.selectedFiles = undefined;
  }

  private upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('contract_id', this.selectedContract.id + '');
    formData.append('document_name', this.f['documentName'].value);
    formData.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.apiUrl}/document/upload`,
      formData,
      { reportProgress: true, responseType: 'json' }
    );

    return this.http.request(req);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addDocumentForm.controls;
  }
}
