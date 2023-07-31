import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppointmentRequest } from "../../../../../shared/models/AppointmentRequest";

@Component({
  selector: 'appointment-confirm-dialog',
  templateUrl: './appointment-confirm-dialog.component.html',
  styleUrls: ['./appointment-confirm-dialog.component.scss']
})
export class AppointmentConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AppointmentConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentRequest
  ) {
  }

  onReject() {
    this.dialogRef.close();
  }
}

