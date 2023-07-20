import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentConfirmDialogComponent } from './appointment-confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: AppointmentConfirmDialogComponent;
  let fixture: ComponentFixture<AppointmentConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentConfirmDialogComponent]
    });
    fixture = TestBed.createComponent(AppointmentConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
