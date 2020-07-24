import { Component, OnInit } from '@angular/core';
import { Debtor } from '@app/models';
import { DebtorCachedService } from '@shared/services';
import { Router } from '@angular/router';
import { Calendar } from '@app/models/calendar';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { first } from 'rxjs/operators';

interface CalendarTableElement extends Calendar{
  // empty extends
}
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  debtor: Debtor;
  calendarList: CalendarTableElement[];

  constructor(
    private debtorCachedService: DebtorCachedService,
    private router: Router,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    if(!this.debtorCachedService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    this.debtor = this.debtorCachedService.debtor;

    // get data
    this.http.get<any>(`${environment.apiUrl}/get/debtor/` + this.debtor.id + `/calendars`,
      {}
    ).pipe(first())
      .subscribe(
        data => {
          this.calendarList = data;

          console.log(this.calendarList);


        },
        error => {
          console.log(error);
        }
      );
  }

}
