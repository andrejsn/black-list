import { TestBed } from '@angular/core/testing';

import { CurrentlyTitleService } from './currently-title.service';

describe('CurrentlyTitleService', () => {
  let service: CurrentlyTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentlyTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
