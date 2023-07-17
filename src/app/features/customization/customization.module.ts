import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';

import { ReactiveFormsModule } from '@angular/forms';
import { AddEditCompanyComponent } from './add-edit-company/add-edit-company.component';
import { CustomizationRoutingModule } from './customization-routing.module';

@NgModule({
  declarations: [AddEditCompanyComponent],
  imports: [
    CommonModule,
    CustomizationRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
})
export class CustomizationModule {}
