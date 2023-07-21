import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicalRecordRoutingModule } from './medical-record-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { DetailedMedicalRecordComponent } from './detailed-medical-record/detailed-medical-record.component';

@NgModule({
  declarations: [DetailedMedicalRecordComponent],
  imports: [
    CommonModule,
    MedicalRecordRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
  ],
})
export class MedicalRecordModule {}
