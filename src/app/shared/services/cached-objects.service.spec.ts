import { TestBed } from '@angular/core/testing';

import { CachedObjectsService } from './cached-objects.service';

describe('CachedObjectsService', () => {
  let service: CachedObjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachedObjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
