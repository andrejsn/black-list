import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderPayComponent } from './reminder-pay.component';

describe('ReminderPayComponent', () => {
  let component: ReminderPayComponent;
  let fixture: ComponentFixture<ReminderPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
