import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { SnotifyService, Snotify } from 'ng-snotify';

import { Contract,  Guarantor } from '@app/models';
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
  animations: [inOutAnimation()],
})
export class GuarantorsComponent implements OnInit {
  @Input() contract: Contract;
  guarantorsList: GuarantorTableElement[];
  visible: boolean = false;
  count: number;

  loading: boolean;

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private snotifyService: SnotifyService,
  ) {}

  ngOnInit(): void {
    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/contract/` +
          this.contract.id +
          `/guarantors`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.guarantorsList = data;
          this.count = this.guarantorsList.length;
          // console.log(this.guarantorsList);
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
    this.guarantorsList.forEach((guarantor) => {
      guarantor.visible = guarantor.id === id ? !guarantor.visible : false;
    });
  }

  editGuarantor(guarantorToEdit: GuarantorTableElement) {
    this.objectsService.guarantor = guarantorToEdit;
    this.router.navigate(['/edit/guarantor']);
  }

  /**
   * delete representative
   * @param guarantorToDelete - representative
   */
  notifyDeleteGuarantor(guarantorToDelete: GuarantorTableElement) {
    this.loading = true;
    guarantorToDelete.toDelete = true;

    this.snotifyService
      .confirm('The guarantor will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes',
            action: () => this.deleteGuarantor(guarantorToDelete),
            bold: false,
          },
          {
            text: 'No',
            action: () =>
              this.cancelDeleteGuarantor(guarantorToDelete),
          },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeleteGuarantor(guarantorToDelete);
      });
  }

  private deleteGuarantor(guarantorToDelete: GuarantorTableElement) {
    console.log('delete guarantor: ' + guarantorToDelete.name);
  }

  private cancelDeleteGuarantor(
    guarantorToDelete: GuarantorTableElement
  ) {
    guarantorToDelete.toDelete = false;
  }
}
