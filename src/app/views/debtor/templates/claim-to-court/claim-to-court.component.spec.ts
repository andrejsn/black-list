import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimToCourtComponent } from './claim-to-court.component';

describe('ClaimToCourtComponent', () => {
  let component: ClaimToCourtComponent;
  let fixture: ComponentFixture<ClaimToCourtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimToCourtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimToCourtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
