import {Component} from '@angular/core';
import { navItems } from '../../_nav';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  styles: ['.xxx {font-size: xxx-large;}'],
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

constructor(public translate: TranslateService){}

  toggleMinimize(e: boolean) {
    this.sidebarMinimized = e;
  }

}
