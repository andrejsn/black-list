import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Debtor, Contract } from '@app/models';
import { ObjectsService } from '@shared/services';

interface ContractTableElement extends Contract {
  visible: boolean;
}

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements OnInit {
  selectedDebtor: Debtor;
  contractsList: ContractTableElement[];
  count: number;

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.objectsService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- contracts list');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: false },
      {
        route: '/debtor',
        name: 'Debtor: ' + this.selectedDebtor.company,
        active: false,
      },
      { route: '/debtor/contracts', name: 'Contracts', active: true },
    ]);

    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/debtor/` +
          this.selectedDebtor.id +
          `/contracts`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.contractsList = data;
          this.count = this.contractsList.length;
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
    this.contractsList.forEach((contract) => {
      contract.visible = contract.id === id ? !contract.visible : false;
    });
  }
}
