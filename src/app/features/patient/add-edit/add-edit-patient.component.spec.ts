import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPatient } from './add-edit-patient.component';

describe('AddEditComponent', () => {
  let component: AddEditPatient;
  let fixture: ComponentFixture<AddEditPatient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditPatient]
    });
    fixture = TestBed.createComponent(AddEditPatient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
