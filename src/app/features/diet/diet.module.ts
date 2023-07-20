import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';

import { ReactiveFormsModule } from '@angular/forms';
import { AddEditDietComponent } from './add-edit-diet/add-edit-diet.component';
import { DietRoutingModule } from './diet-routing.module';

@NgModule({
  declarations: [AddEditDietComponent],
  imports: [
    CommonModule,
    DietRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
})
export class DietModule {}
