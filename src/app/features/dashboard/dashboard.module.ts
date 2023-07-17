import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';


@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    CustomMaterialModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
