import { TestBed } from '@angular/core/testing';

import { TaskCachedService } from './task-cached.service';

describe('TaskCachedService', () => {
  let service: TaskCachedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskCachedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
