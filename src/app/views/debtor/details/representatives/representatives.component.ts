import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { first } from 'rxjs/operators';

import { Contract, Representative } from '@app/models';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-representatives',
  templateUrl: './representatives.component.html',
  styleUrls: ['./representatives.component.css']
})
export class RepresentativesComponent implements OnInit {

  @Input() contract: Contract;
  representativesList: Representative[];
  count: number;

  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
       // get data
       this.http.get<any>(`${environment.apiUrl}/get/contract/` + this.contract.id + `/representatives`,
       {}
     ).pipe(first())
       .subscribe(
         data => {

           this.representativesList = data;
           this.count = this.representativesList.length;
           console.log(this.representativesList);
         },
         error => {
           console.log(error);

         }
       );
  }

}
