import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';

import { ReactiveFormsModule } from '@angular/forms';
import { ListLogsComponent } from './list-logs/list-logs.component';
import { LogsRoutingModule } from './logs-routing.module';

@NgModule({
  declarations: [ListLogsComponent],
  imports: [
    CommonModule,
    LogsRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
})
export class LogsModule {}