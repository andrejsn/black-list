import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentlyTitleService {
  currentlyTitle$: Observable<string>;
  private titleSubject: Subject<string>;

  constructor() {
    this.titleSubject = new Subject<string>();
    this.currentlyTitle$ = this.titleSubject.asObservable();
  }

  set title(title: string) {
    this.titleSubject.next(title);
  }
}
