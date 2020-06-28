import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningPayComponent } from './warning-pay.component';

describe('WarningPayComponent', () => {
  let component: WarningPayComponent;
  let fixture: ComponentFixture<WarningPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
