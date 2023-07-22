import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';

import { ReactiveFormsModule } from '@angular/forms';
import { AddEditDrugComponent } from './add-edit-drug/add-edit-drug.component';
import { DrugRoutingModule } from './drug-routing.module';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [AddEditDrugComponent],
  imports: [
    CommonModule,
    DrugRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule
  ],
})
export class DrugModule {}
