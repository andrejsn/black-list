import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditorToAdministratorComponent } from './creditor-to-administrator.component';

describe('CreditorToAdministratorComponent', () => {
  let component: CreditorToAdministratorComponent;
  let fixture: ComponentFixture<CreditorToAdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditorToAdministratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditorToAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
