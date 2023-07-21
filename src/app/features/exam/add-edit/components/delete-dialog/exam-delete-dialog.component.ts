import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'exam-delete-dialog',
  templateUrl: './exam-delete-dialog.component.html',
  styleUrls: ['./exam-delete-dialog.component.scss']
})
export class ExamDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExamDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
  }

  onReject() {
    this.dialogRef.close();
  }
}
