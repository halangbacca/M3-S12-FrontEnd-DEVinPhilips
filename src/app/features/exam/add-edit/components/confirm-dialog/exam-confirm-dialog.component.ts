import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ExamRequest } from "../../../../../shared/models/ExamRequest";
import { ExamConfirmationData } from "../../../../../shared/models/ExamConfirmationData";

@Component({
  selector: 'exam-confirm-dialog',
  templateUrl: './exam-confirm-dialog.component.html',
  styleUrls: ['./exam-confirm-dialog.component.scss']
})
export class ExamConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExamConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExamConfirmationData
  ) {
  }

  onReject() {
    this.dialogRef.close();
  }
}

