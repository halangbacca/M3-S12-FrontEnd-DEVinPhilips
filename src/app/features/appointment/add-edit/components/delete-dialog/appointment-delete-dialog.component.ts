import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'appointment-delete-dialog',
  templateUrl: './appointment-delete-dialog.component.html',
  styleUrls: ['./appointment-delete-dialog.component.scss']
})
export class AppointmentDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AppointmentDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
  }

  onReject() {
    this.dialogRef.close();
  }
}
