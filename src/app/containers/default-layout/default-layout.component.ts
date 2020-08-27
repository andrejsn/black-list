import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { ObjectsService } from '@shared/services';
import { navI18n, navItems } from '@app/_nav';
import { MenuItem } from '@app/models';

@Component({
  selector: 'app-dashboard',
  styles: ['.xxx {font-size: xxx-large;} .i18n_click:hover {cursor:pointer;}'],
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit {
  public sidebarMinimized = false;
  public navItems = navItems;

  // user avatar
  user_name: string;
  // menu elements
  reports: Element;
  debtors: Element;
  add_debtor: Element;
  calendar: Element;
  // breadcump menu active
  active: string = '';


  // use for
  title: string;

  breadcrumbItems:  MenuItem[];
  breadcrumbTitle: String;

  constructor
    (
      private objectsServices: ObjectsService,
      private translate: TranslateService,
      private router: Router
    ) {


     // .currentlyTitle$.subscribe((currentlyTitle: string) => { this.title = currentlyTitle });

    // TODO : to delete
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.translateActiveBreadcrump(event.url);
      }
    });
  }
  ngOnInit(): void {
    this.user_name = JSON.parse(localStorage.getItem('user')).name;
    this.objectsServices.getTitle().subscribe(currentTitle => this.breadcrumbTitle = currentTitle);

  }


  ngAfterViewInit(): void {
    const elements = document.getElementsByTagName('app-sidebar-nav-link-content');

    this.reports = elements.item(0);
    this.debtors = elements.item(1);
    this.add_debtor = elements.item(2);
    this.calendar = elements.item(3);

    this.translate.use(this.translate.currentLang);
    this.translateTo(this.translate.currentLang);
  }

  /*
   FIXME use i18n from cui, if exist?
   */
  translateTo(language: string): void {
    this.translate.use(language);
    // translate menu
    this.translate.get('app-sidebar-nav-link.reports').subscribe((res: string) => { this.reports.innerHTML = this.reports.innerHTML.replace(navI18n[0], res); })
    this.translate.get('app-sidebar-nav-link.debtors').subscribe((res: string) => { this.debtors.innerHTML = this.debtors.innerHTML.replace(navI18n[1], res); })
    this.translate.get('app-sidebar-nav-link.add_debtor').subscribe((res: string) => { this.add_debtor.innerHTML = this.add_debtor.innerHTML.replace(navI18n[2], res); })
    this.translate.get('app-sidebar-nav-link.calendar').subscribe((res: string) => { this.calendar.innerHTML = this.calendar.innerHTML.replace(navI18n[3], res); })

    this.translateActiveBreadcrump(this.router.url);
  }

  /**
   * I18n for active breadcrump
   *
   * @param url - current url
   */
  translateActiveBreadcrump(url: string) {
    if (url === '/' || url === navItems[0].url) {
      this.translate.get('app-sidebar-nav-link.reports').subscribe((res: string) => { this.active = res; });
    } else if (url === navItems[1].url) {
      this.translate.get('app-sidebar-nav-link.debtors').subscribe((res: string) => { this.active = res; });
    } else if (url === navItems[2].url) {
      this.translate.get('app-sidebar-nav-link.add_debtor').subscribe((res: string) => { this.active = res; });
    } else if (url === navItems[3].url) {
      this.translate.get('app-sidebar-nav-link.calendar').subscribe((res: string) => { this.active = res; });
    }
  }

  toggleMinimize(e: boolean) {
    this.sidebarMinimized = e;
  }

}
