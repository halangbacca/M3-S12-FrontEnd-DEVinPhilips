import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { AddEditPatient } from './add-edit/add-edit-patient.component';
import { ConfirmDialogComponent } from './add-edit/components/confirm-dialog/confirm-dialog.component';
import { DeleteDialogComponent } from './add-edit/components/delete-dialog/delete-dialog.component';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatBadgeModule } from "@angular/material/badge";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NgxMaskDirective } from "ngx-mask";
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  declarations: [
    AddEditPatient,
    ConfirmDialogComponent,
    DeleteDialogComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    NgxMaskDirective,
    MatDialogModule,
    SharedModule
  ]
})
export class PatientModule { }
