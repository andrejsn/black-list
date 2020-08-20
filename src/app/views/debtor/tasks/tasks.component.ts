import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';

import { Debtor, Task } from '@app/models';
import { environment } from '@environments/environment';
import { CachedObjectsService } from '@shared/services';

interface CalendarTaskElement extends Task {
  visible: boolean;
  isChecked: boolean;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  debtor: Debtor;
  taskList: CalendarTaskElement[] = [];
  loading: boolean;

  constructor(
    private cachedObjectsService: CachedObjectsService,
    private router: Router,
    private translate: TranslateService,
    private http: HttpClient,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    if (!this.cachedObjectsService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }

    this.debtor = this.cachedObjectsService.debtor;
    this.loading = false;

    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/debtor/` + this.debtor.id + `/calendars`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.taskList = data;

          console.log(this.taskList);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * toggle row
   */
  toggle(taskList: CalendarTaskElement[], index: number) {
    for (let i = 0; i < taskList.length; i++) {
      const debtor = taskList[i];
      const selector = `.row-num-${i}`;

      if (i === index) {
        document.querySelector(selector).classList.toggle('d-none');
        debtor.visible = !debtor.visible;
      } else {
        document.querySelector(selector).classList.add('d-none');
        debtor.visible = false;
      }
    }
  }

  /**
   * on check done
   */
  onChecked(calendar: CalendarTaskElement) {
    console.log(calendar.isChecked); // {}, true || false

    // TODO get to server - change done
  }

  /**
   * edit task
   */
  editTask(calendar: CalendarTaskElement) {
    this.cachedObjectsService.task = calendar;
    this.router.navigate(['/edit/task']);
  }

  /**
   * delete task with id
   * @param id - calendar id
   */
  notifyDeleteTask(calendar: CalendarTaskElement, index: number) {
    this.loading = true;
    const selector = `.note-num-${index}`;
    document.querySelector(selector).classList.add('to-delete');

    this.snotifyService
      .confirm('The task will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          { text: 'Yes', action: () => this.deleteTask(calendar), bold: false },
          { text: 'No', action: () => this.cancelDeleteTask(index) },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeleteTask(index);
      });
  }

  private cancelDeleteTask(index: number) {
    this.loading = false;
    const selector = `.note-num-${index}`;
    document.querySelector(selector).classList.remove('to-delete');
  }

  private deleteTask(task: CalendarTaskElement) {
    this.http
      .post<any>(`${environment.apiUrl}/destroy/task`, { id: task.id })
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.deleted) {
            // this.taskList = this.taskList.filter( //this.taskList.slice(1);
            //   (element) => element.id !== data.deleted
            // );

            this.taskList = reject(this.taskList, function (
              calendarElement
            ) {
              // console.log(calendarElement.id);
              // console.log(data.deleted);
              // console.log(calendarElement.id as number !== data.deleted as number);

              return (
                (calendarElement.id as number) === (data.deleted as number)
              );
            });

            console.log(this.taskList);
          }
        },
        (error) => {
          this.loading = false;
          this.translate
            .get('toast.error.response')
            .subscribe((error: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }
}
