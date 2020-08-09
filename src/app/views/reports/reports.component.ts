import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private snotifyService: SnotifyService) { }

  ngOnInit(): void {
    this.snotifyService.info('Hello world');
  }

}
