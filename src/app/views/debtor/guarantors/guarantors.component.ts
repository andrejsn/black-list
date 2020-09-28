import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { ContractTableElement, Guarantor } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

interface GuarantorTableElement extends Guarantor {
  toDelete: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-guarantors',
  templateUrl: './guarantors.component.html',
  styleUrls: ['./guarantors.component.scss'],
  animations: [inOutAnimation()]
})
export class GuarantorsComponent implements OnInit {
  @Input() contract: ContractTableElement;
  guarantorsList: GuarantorTableElement[] = [];
  visibleList: boolean = false;

  loading: boolean;

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private snotifyService: SnotifyService) { }

  ngOnInit(): void { // should be list visible?
    if (this.objectsService.guarantor) {
      this.visibleList = true;

      console.log(this.visibleList);

      // reset another
      this.objectsService.representative = null;
      this.objectsService.invoice = null;
    }

    // get data
    this.http.get<any>(`${environment.apiUrl}/get/contract/`
      + this.contract.id
      + `/guarantors`, {}
    ).pipe(first()).subscribe((data) => {
      const tmp = data as GuarantorTableElement[];
      this.guarantorsList = tmp;
    }, (error) => {
      console.log(error);
    });
  }

  /**
  * toggle row
  */
  toggle(id: number) {
    this.guarantorsList.forEach((guarantor) => {
      guarantor.visible = guarantor.id === id ? !guarantor.visible : false;
    });
  }

  editGuarantor(selectedGuarantor: GuarantorTableElement) {
    this.objectsService.guarantor = selectedGuarantor;
    this.router.navigate(['/edit/guarantor']);
  }

  /**
  * delete guarantor
  * @param guarantorToDelete - guarantor
  */
  notifyDeleteGuarantor(guarantorToDelete: GuarantorTableElement) {
    this.loading = true;
    guarantorToDelete.toDelete = true;

    this.snotifyService.confirm('The guarantor will be deleted', 'Are you sure?', {
      timeout: 5000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {
          text: 'Yes',
          action: () => this.deleteGuarantor(guarantorToDelete),
          bold: false
        }, {
          text: 'No',
          action: () => this.cancelDeleteGuarantor(guarantorToDelete)
        },
      ]
    }).on('beforeHide', (toast: Snotify) => {
      this.cancelDeleteGuarantor(guarantorToDelete);
    });
  }

  private deleteGuarantor(guarantorToDelete: GuarantorTableElement) {
    this.http.post<any>(`${environment.apiUrl
      }/guarantor/destroy`, { id: guarantorToDelete.id }).pipe(first()).subscribe((data) => {
        const response = data;
        // TODO: data.error ?
        if (response.deleted) {
          this.guarantorsList = reject(this.guarantorsList, function (guarantor: GuarantorTableElement) {
            return (guarantor.id as number) === (response.deleted as number);
          });
        }
      }, (error) => {
        this.loading = false;
        this.translate.get('toast.error.response').subscribe((err: string) => {
          this.snotifyService.error(error);
        });
      });
  }

  private cancelDeleteGuarantor(guarantorToDelete: GuarantorTableElement) {
    guarantorToDelete.toDelete = false;
  }
}
