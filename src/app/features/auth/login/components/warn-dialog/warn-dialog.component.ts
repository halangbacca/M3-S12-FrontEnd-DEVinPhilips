import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-warn-dialog',
  templateUrl: './warn-dialog.component.html',
  styleUrls: ['./warn-dialog.component.scss']
})
export class WarnDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<WarnDialogComponent>
  ) {
  }

  close() {
    this.dialogRef.close();
  }
}
