import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAppointment } from './add-edit-appointment.component';

describe('AppointmentComponent', () => {
  let component: AddEditAppointment;
  let fixture: ComponentFixture<AddEditAppointment>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditAppointment]
    });
    fixture = TestBed.createComponent(AddEditAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
