import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WarnDialogComponent } from './login/components/warn-dialog/warn-dialog.component';
import { ResetPasswordDialogComponent } from './login/components/reset-password-dialog/reset-password-dialog.component';


@NgModule({
  declarations: [
    LoginComponent,
    WarnDialogComponent,
    ResetPasswordDialogComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
