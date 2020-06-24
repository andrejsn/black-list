import { TestBed } from '@angular/core/testing';

import { DebtorCachedService } from './debtor-cached.service';

describe('DebtorCachedService', () => {
  let service: DebtorCachedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebtorCachedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
