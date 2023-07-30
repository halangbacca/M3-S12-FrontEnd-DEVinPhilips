import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ListMedicalRecordComponent } from './list-medical-record/list-medical-record.component';
import { DetailedMedicalRecordComponent } from './detailed-medical-record/detailed-medical-record.component';

const routes: Routes = [
  {
    path: '',
    title: 'LABMedical - Prontuário',
    component: LayoutComponent,
    children: [
      { path: '', component: ListMedicalRecordComponent },
      { path: 'detailed/:id', component: DetailedMedicalRecordComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalRecordRoutingModule {}
