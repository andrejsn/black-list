import {
  Component,
  OnInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';


import { ObjectsService } from '@shared/services';
import { MenuItem } from '@app/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent
  implements OnInit {
  public sidebarMinimized = false;


  // user avatar
  user_name: string;

  // breadcump menu active
  active: string = '';

  // use for
  title: string;

  breadcrumbItems: MenuItem[];

  constructor(
    private objectsServices: ObjectsService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user_name = JSON.parse(localStorage.getItem('user')).name;
    // this.objectsServices
    //   .getTitle()
    //   .subscribe((currentTitle) => (this.breadcrumbItems = currentTitle));
    // this.cdRef.detectChanges();

  }

  translateTo(language: string): void {
    this.translate.use(language);
  }

  toggleMinimize(e: boolean) {
    this.sidebarMinimized = e;
  }
}
