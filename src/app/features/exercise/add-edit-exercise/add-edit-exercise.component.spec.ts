import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExerciseComponent } from './add-edit-exercise.component';

describe('AddEditExerciseComponent', () => {
  let component: AddEditExerciseComponent;
  let fixture: ComponentFixture<AddEditExerciseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditExerciseComponent]
    });
    fixture = TestBed.createComponent(AddEditExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
