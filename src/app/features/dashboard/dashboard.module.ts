import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    CommonModule,
    CustomMaterialModule,
    DashboardRoutingModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class DashboardModule {}
