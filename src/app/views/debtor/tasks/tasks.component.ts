import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';
import * as moment from 'moment';

import { Debtor, Task } from '@app/models';
import { environment } from '@environments/environment';
import { CachedObjectsService } from '@shared/services';

interface TableTaskElement extends Task {
  visible: boolean;
  remind_status?: string;
}

const statuses = {
  DONE: 'success',
  INFO: 'info',
  WARNING: 'warning',
  IMPORTANT: 'danger',
};

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  today: moment.Moment;
  debtor: Debtor;
  taskList: TableTaskElement[] = [];
  remind_important_count: number;
  remind_warning_count: number;
  remind_info_count: number;

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

    Object.freeze(statuses);
    this.remind_important_count = 0;
    this.remind_warning_count = 0;
    this.remind_info_count = 0;
    this.today = moment();
    this.debtor = this.cachedObjectsService.debtor;
    this.loading = false;

    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/debtor/` + this.debtor.id + `/tasks`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          const tmp = data as Task[];
          this.taskList = tmp.map((task: Task) => {
            return {
              visible: false,
              id: task.id,
              debtor_id: task.debtor_id,
              debtor_company: task.debtor_company,
              date: task.date,
              note: task.note,
              remind_date: task.remind_date,
              remind_note: task.remind_note,
              remind_done: task.remind_done,
              remind_status: this.remindStatus(task),
            };
          });

          console.log(this.taskList);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private remindStatus(task: Task): string {
    // has in the task a reminder?
    if (task.remind_date) {
      // is remind done?
      if (task.remind_done === '1') {
        return statuses.DONE;
      }

      const date: moment.Moment = moment(new Date(task.remind_date));
      // is remind for today?
      if (this.today.isSame(date, 'day')) {
        this.remind_warning_count++;
        return statuses.WARNING;
      }
      // is a reminder in the future?
      if (this.today.isBefore(moment(date), 'day')) {
        this.remind_info_count++;
        return statuses.INFO;
      }
      // important reminder!
      this.remind_important_count++;
      return statuses.IMPORTANT;
    }
    return null;
  }

  /**
   * toggle row
   */
  toggle(taskList: TableTaskElement[], index: number) {
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
   * on check task as done
   */
  changeDoneTask(task: TableTaskElement) {
    let url: string;
    if (parseInt(task.remind_done, 10) === 1) {
      url = `${environment.apiUrl}/task/undone`;
    } else {
      url = `${environment.apiUrl}/task/done`;
    }

    this.http
      .post<any>(url, { id: task.id })
      .pipe(first())
      .subscribe(
        (data) => {
          const request = data;
          // TODO: data.error ?
          if (request.task_id) {
            task.remind_done = '' + request.done;
            task.remind_status = this.remindStatus(task);
          }
        },
        (error) => {
          this.loading = false;
          this.translate
            .get('toast.error.response')
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }

  /**
   * edit task
   */
  editTask(task: TableTaskElement) {
    this.cachedObjectsService.task = task;
    this.router.navigate(['/edit/task']);
  }

  /**
   * delete task with id
   * @param id - calendar id
   */
  notifyDeleteTask(calendar: TableTaskElement, index: number) {
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

  private deleteTask(task: TableTaskElement) {
    this.http
      .post<any>(`${environment.apiUrl}/task/destroy`, { id: task.id })
      .pipe(first())
      .subscribe(
        (data) => {
          // TODO: data.error ?
          if (data.deleted) {
            // this.taskList = this.taskList.filter( //this.taskList.slice(1);
            //   (element) => element.id !== data.deleted
            // );

            this.taskList = reject(this.taskList, function (calendarElement) {
              // console.log(calendarElement.id);isChecked
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
            .subscribe((err: string) => {
              this.snotifyService.error(error);
            });
        }
      );
  }
}
