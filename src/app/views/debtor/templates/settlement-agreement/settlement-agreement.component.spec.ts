import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementAgreementComponent } from './settlement-agreement.component';

describe('SettlementAgreementComponent', () => {
  let component: SettlementAgreementComponent;
  let fixture: ComponentFixture<SettlementAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
