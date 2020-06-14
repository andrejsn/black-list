import { Component, AfterViewInit } from '@angular/core';
import { navItems } from '../../_nav';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  styles: ['.xxx {font-size: xxx-large;}'],
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements AfterViewInit {
  public sidebarMinimized = false;
  public navItems = navItems;

  // menu elements
  reports: Element;
  debtors: Element;
  add_debtor: Element;
  calendar: Element;
  // breadcrumb menu
  breadcrumb: Element;

  // ATTENTION : this values sync to navigation list & en.json|ru.json|lv.json
  reports_re: RegExp = /Reports|Отчёты|Atskaites/g;
  debtors_re: RegExp = /Debtors|Должники|Parādnieki/g;
  add_debtor_re: RegExp = /Add Debtor|Должника добавить|Parādnieku pievienot/g;
  calendar_re: RegExp = /Calendar|Календарь|Kalendārs/g;

  constructor(public translate: TranslateService) { }
  ngAfterViewInit(): void {
    this.breadcrumb = document.getElementsByClassName('breadcrumb').item(0);
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
    this.translate.get('app-sidebar-nav-link.reports').subscribe((res: string) => { this.reports.innerHTML = this.reports.innerHTML.replace(this.reports_re, res); })
    this.translate.get('app-sidebar-nav-link.debtors').subscribe((res: string) => { this.debtors.innerHTML = this.debtors.innerHTML.replace(this.debtors_re, res); })
    this.translate.get('app-sidebar-nav-link.add_debtor').subscribe((res: string) => { this.add_debtor.innerHTML = this.add_debtor.innerHTML.replace(this.add_debtor_re, res); })
    this.translate.get('app-sidebar-nav-link.calendar').subscribe((res: string) => { this.calendar.innerHTML = this.calendar.innerHTML.replace(this.calendar_re, res); })

    // translate breadcrumb
    if (this.reports_re.test(this.breadcrumb.innerHTML)) {
      this.translate.get('app-sidebar-nav-link.reports').subscribe((res: string) => { this.breadcrumb.innerHTML = this.breadcrumb.innerHTML.replace(this.reports_re, res); })
    } else if (this.debtors_re.test(this.breadcrumb.innerHTML)) {
      this.translate.get('app-sidebar-nav-link.debtors').subscribe((res: string) => { this.breadcrumb.innerHTML = this.breadcrumb.innerHTML.replace(this.debtors_re, res); })
    } else if (this.add_debtor_re.test(this.breadcrumb.innerHTML)) {
      this.translate.get('app-sidebar-nav-link.add_debtor').subscribe((res: string) => { this.breadcrumb.innerHTML = this.breadcrumb.innerHTML.replace(this.add_debtor_re, res); })
    } else if (this.calendar_re.test(this.breadcrumb.innerHTML)) {
      this.translate.get('app-sidebar-nav-link.calendar').subscribe((res: string) => { this.breadcrumb.innerHTML = this.breadcrumb.innerHTML.replace(this.calendar_re, res); })
    }
  }

  toggleMinimize(e: boolean) {
    this.sidebarMinimized = e;
  }

}
