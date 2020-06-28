import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningPreTrialComponent } from './warning-pre-trial.component';

describe('WarningPreTrialComponent', () => {
  let component: WarningPreTrialComponent;
  let fixture: ComponentFixture<WarningPreTrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningPreTrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPreTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
