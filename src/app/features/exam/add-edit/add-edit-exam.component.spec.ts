import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExamComponent } from './add-edit-exam.component';

describe('ExamComponent', () => {
  let component: AddEditExamComponent;
  let fixture: ComponentFixture<AddEditExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditExamComponent]
    });
    fixture = TestBed.createComponent(AddEditExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
