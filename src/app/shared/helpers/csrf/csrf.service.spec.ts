import { TestBed } from '@angular/core/testing';

import { CSRFService } from './csrf.service';

describe('CSRFService', () => {
  let service: CSRFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CSRFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
