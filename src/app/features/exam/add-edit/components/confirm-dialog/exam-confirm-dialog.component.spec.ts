import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamConfirmDialogComponent } from './exam-confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ExamConfirmDialogComponent;
  let fixture: ComponentFixture<ExamConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamConfirmDialogComponent]
    });
    fixture = TestBed.createComponent(ExamConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
