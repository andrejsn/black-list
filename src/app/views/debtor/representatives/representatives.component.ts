import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { Contract, Representative } from '@app/models';
import { environment } from '@environments/environment';
import { inOutAnimation } from '@shared/helpers';
import { ObjectsService } from '@shared/services';

interface RepresentativeTableElement extends Representative {
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
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {


console.log('############################ ' + this.contract.id);


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
}
