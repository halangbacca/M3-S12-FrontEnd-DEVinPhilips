import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedMedicalRecordComponent } from './detailed-medical-record.component';

describe('DetailedMedicalRecordComponent', () => {
  let component: DetailedMedicalRecordComponent;
  let fixture: ComponentFixture<DetailedMedicalRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedMedicalRecordComponent]
    });
    fixture = TestBed.createComponent(DetailedMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
