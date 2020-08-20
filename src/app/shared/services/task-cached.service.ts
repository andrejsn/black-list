import { Injectable } from '@angular/core';
import { Task } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class TaskCachedService {
  task: Task;

  constructor() { }
}
