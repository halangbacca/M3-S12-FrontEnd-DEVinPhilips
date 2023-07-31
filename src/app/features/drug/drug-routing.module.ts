import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { AddEditDrugComponent } from './add-edit-drug/add-edit-drug.component';

const routes: Routes = [
  {
    path: '',
    title: 'LABMedical - Cadastrar Medicamento',
    component: LayoutComponent,
    children: [{ path: '', component: AddEditDrugComponent }],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrugRoutingModule {}
