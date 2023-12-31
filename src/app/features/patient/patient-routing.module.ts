import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditPatient } from "./add-edit/add-edit-patient.component";
import { LayoutComponent } from "../../shared/layout/layout.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'add',
        title: 'LABMedical - Cadastrar Paciente',
        component: AddEditPatient
      },
      {
        path: 'edit/:id',
        title: 'LABMedical - Editar Paciente',
        component: AddEditPatient
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
