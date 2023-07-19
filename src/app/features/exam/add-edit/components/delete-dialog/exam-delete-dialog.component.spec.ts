import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamDeleteDialogComponent } from './exam-delete-dialog.component';

describe('DeleteDialogComponent', () => {
  let component: ExamDeleteDialogComponent;
  let fixture: ComponentFixture<ExamDeleteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamDeleteDialogComponent]
    });
    fixture = TestBed.createComponent(ExamDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
