import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

import {first} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {SnotifyService, Snotify} from 'ng-snotify';
import * as reject from 'lodash.reject';
import * as moment from 'moment';

import {Debtor, Contract, Guarantor} from '@app/models';
import {environment} from '@environments/environment';
import {ObjectsService} from '@shared/services';

@Component({selector: 'app-document', templateUrl: './document.component.html', styleUrls: ['./document.component.css']})
export class DocumentComponent implements OnInit {
    selectedDebtor : Debtor;
    selectedContract : Contract;

    addDocumentForm = new FormGroup({name: new FormControl()});

    submitted : boolean = false;
    loading : boolean = false;

    constructor(private title : Title, private objectsService : ObjectsService, private router : Router, private translate : TranslateService, private http : HttpClient, private formBuilder : FormBuilder, private snotifyService : SnotifyService) {}

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
            name: [
                '',
                [Validators.required]
            ]

        });
    }

    /**
   * submit form
   */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.addDocumentForm.invalid) {
            this.translate.get('toast.error.template.form').subscribe((error : string) => {
                this.snotifyService.error(error);
            });

            return;
        }
    }


    // convenience getter for easy access to form fields
    get f() {
        return this.addDocumentForm.controls;
    }
}
