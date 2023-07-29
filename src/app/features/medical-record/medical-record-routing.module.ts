import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ListMedicalRecordComponent } from './list-medical-record/list-medical-record.component';

const routes: Routes = [
  {
    path: '',
    title: 'LABMedical - Prontuario',
    component: LayoutComponent,
    children: [{ path: '', component: ListMedicalRecordComponent }],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalRecordRoutingModule {}
