import { Component, OnInit } from '@angular/core';
import { DebtorCachedService } from '@app/shared/services';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private debtorCachedService: DebtorCachedService) { }

  ngOnInit(): void {
    console.log(this.debtorCachedService.debtor.company);

  }

}
