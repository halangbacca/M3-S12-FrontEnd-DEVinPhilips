import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDeleteDialogComponent } from './appointment-delete-dialog.component';

describe('DeleteDialogComponent', () => {
  let component: AppointmentDeleteDialogComponent;
  let fixture: ComponentFixture<AppointmentDeleteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentDeleteDialogComponent]
    });
    fixture = TestBed.createComponent(AppointmentDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
