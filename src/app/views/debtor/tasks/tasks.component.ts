import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService, Snotify } from 'ng-snotify';
import * as reject from 'lodash.reject';
import * as moment from 'moment';

import { Debtor, Task } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

interface TaskTableElement extends Task {
  toDelete: boolean;
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
  selectedDebtor: Debtor;
  selectedTask: Task;
  tasksList: TaskTableElement[] = [];
  remind_important_count: number;
  remind_warning_count: number;
  remind_info_count: number;

  loading: boolean;

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    if (!this.objectsService.debtor) {
      // no debtor cached
      this.router.navigate(['/debtors']);

      return;
    }
    this.selectedDebtor = this.objectsService.debtor;

    if (this.objectsService.task) {
      this.selectedTask = this.objectsService.task;
    }

    // set browser title
    this.title.setTitle(this.selectedDebtor.company + '- tasks list');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/debtors', name: 'Debtors', active: false },
      {
        route: '/debtor',
        name: 'Debtor: ' + this.selectedDebtor.company,
        active: false,
      },
      { route: '/debtor/tasks', name: 'Tasks', active: true },
    ]);

    Object.freeze(statuses);
    this.today = moment();
    this.loading = false;

    // get data
    this.http
      .get<any>(
        `${environment.apiUrl}/get/debtor/` + this.selectedDebtor.id + `/tasks`,
        {}
      )
      .pipe(first())
      .subscribe(
        (data) => {
          const tmp = data as Task[];
          this.tasksList = tmp.map((task: Task) => {
            return {
              toDelete: false,
              visible: this.taskVisible(task),
              id: task.id,
              date: task.date,
              note: task.note,
              remind_date: task.remind_date,
              remind_note: task.remind_note,
              remind_done: task.remind_done,
              remind_status: this.remindStatus(task),
            };
          });

          this.refreshStatusesCount();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private refreshStatusesCount() {
    this.remind_important_count = 0;
    this.remind_warning_count = 0;
    this.remind_info_count = 0;

    this.tasksList.forEach((task) => {
      if (task.remind_status === statuses.IMPORTANT) {
        this.remind_important_count++;
      } else if (task.remind_status === statuses.WARNING) {
        this.remind_warning_count++;
      } else if (task.remind_status === statuses.INFO) {
        this.remind_info_count++;
      }
    });
  }

  private taskVisible(task: Task): boolean {
    return (
      this.selectedTask && task.remind_date && this.selectedTask.id === task.id
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
        return statuses.WARNING;
      }
      // is a reminder in the future?
      if (this.today.isBefore(moment(date), 'day')) {
        return statuses.INFO;
      }
      // important reminder!
      return statuses.IMPORTANT;
    }

    return null;
  }

  /**
   * toggle row
   */
  toggle(id: number) {
    this.tasksList.forEach((task) => {
      task.visible = task.id === id ? !task.visible : false;
    });
  }

  /**
   * on check task as done
   */
  changeDoneTask(task: TaskTableElement) {
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

            this.refreshStatusesCount();
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
  editTask(task: TaskTableElement) {
    this.objectsService.task = task;
    this.router.navigate(['/edit/task']);
  }

  /**
   * delete task with id
   * @param taskToDelete - calendar task
   */
  notifyDeleteTask(taskToDelete: TaskTableElement) {
    this.loading = true;
    taskToDelete.toDelete = true;

    this.snotifyService
      .confirm('The task will be deleted', 'Are you sure?', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes',
            action: () => this.deleteTask(taskToDelete),
            bold: false,
          },
          { text: 'No', action: () => this.cancelDeleteTask(taskToDelete) },
        ],
      })
      .on('beforeHide', (toast: Snotify) => {
        this.cancelDeleteTask(taskToDelete);
      });
  }

  private cancelDeleteTask(taskToDelete: TaskTableElement) {
    this.loading = false;
    taskToDelete.toDelete = false;
  }

  private deleteTask(taskToDestroy: TaskTableElement) {
    this.http
      .post<any>(`${environment.apiUrl}/task/destroy`, { id: taskToDestroy.id })
      .pipe(first())
      .subscribe(
        (data) => {
          const response = data;
          // TODO: data.error ?
          if (response.deleted) {
            this.tasksList = reject(this.tasksList, function (
              task: TaskTableElement
            ) {
              return (task.id as number) === (response.deleted as number);
            });

            this.refreshStatusesCount();
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
