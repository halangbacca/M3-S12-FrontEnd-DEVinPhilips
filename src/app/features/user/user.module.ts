import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';

import { ReactiveFormsModule } from '@angular/forms';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [AddEditUserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
