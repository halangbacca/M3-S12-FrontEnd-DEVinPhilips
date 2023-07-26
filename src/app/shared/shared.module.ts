import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { RouterModule } from '@angular/router';
import { CpfPipe } from './pipes/cpf/cpf.pipe';
import { CepPipe } from './pipes/cep/cep.pipe';
import { PhonePipe } from './pipes/phone/phone.pipe';

@NgModule({
  declarations: [LayoutComponent, CpfPipe, CepPipe, PhonePipe],
  imports: [CommonModule, CustomMaterialModule, RouterModule],
  exports: [CustomMaterialModule, CpfPipe, CepPipe, PhonePipe],
})
export class SharedModule {}
