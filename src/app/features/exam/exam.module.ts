import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { AddEditExamComponent } from './add-edit/add-edit-exam.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ExamConfirmDialogComponent } from "./add-edit/components/confirm-dialog/exam-confirm-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ExamDeleteDialogComponent } from "./add-edit/components/delete-dialog/exam-delete-dialog.component";


@NgModule({
  declarations: [
    AddEditExamComponent,
    ExamConfirmDialogComponent,
    ExamDeleteDialogComponent
  ],
  imports: [
    CommonModule,
    ExamRoutingModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    DatePipe
  ]
})
export class ExamModule { }
