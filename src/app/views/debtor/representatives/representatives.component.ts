import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { Contract, Representative } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

interface RepresentativeTableElement extends Representative {
  toDelete: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-representatives',
  templateUrl: './representatives.component.html',
  styleUrls: ['./representatives.component.scss'],
  animations: [inOutAnimation()],
})
export class RepresentativesComponent implements OnInit {
  @Input() contract: Contract;
  representativesList: RepresentativeTableElement[];
  visible: boolean = false;
  count: number;

  loading: boolean;

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private snotifyService: SnotifyService,
  ) {}

  ngOnInit(): void {
    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/contract/` +
          this.contract.id +
          `/representatives`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.representativesList = data;
          this.count = this.representativesList.length;

          // console.log(this.representativesList);
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
    this.representativesList.forEach((representative) => {
      representative.visible =
        representative.id === id ? !representative.visible : false;
    });
  }

  editRepresentative(representative: RepresentativeTableElement) {
    this.objectsService.representative = representative;
    this.router.navigate(['/edit/representative']);
  }

  /**
   * delete representative
   * @param representativeToDelete - representative
   */
  notifyDeleteRepresentative(representativeToDelete: RepresentativeTableElement) {
    this.loading = true;
    representativeToDelete.toDelete = true;

    this.snotifyService
      .confirm('The representative will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes',
            action: () => this.deleteRepresentative(representativeToDelete),
            bold: false,
          },
          {
            text: 'No',
            action: () =>
              this.cancelDeleteRepresentative(representativeToDelete),
          },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeleteRepresentative(representativeToDelete);
      });
  }

  deleteRepresentative(representativeToDestroy: RepresentativeTableElement) {
    this.http
      .post<any>(`${environment.apiUrl}/representative/destroy`, { id: representativeToDestroy.id })
      .pipe(first())
      .subscribe(
        (data) => {
          const response = data;
          // TODO: data.error ?
          if (response.deleted) {
            this.representativesList = reject(this.representativesList, function (
              representative: RepresentativeTableElement
            ) {
              return (representative.id as number) === (response.deleted as number);
            });

            this.count--;
          }
        },
        (error) => {
          this.loading = false;
          this.translate
            .get('toast.error.response')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  cancelDeleteRepresentative(
    representativeToDelete: RepresentativeTableElement
  ) {
    representativeToDelete.toDelete = false;
  }
}
