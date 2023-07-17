import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditComponent } from "./add-edit/add-edit.component";
import { LayoutComponent } from "../../shared/layout/layout.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'add',
        title: 'LABMedical - Cadastrar Paciente',
        component: AddEditComponent
      },
      {
        path: 'edit/:id',
        title: 'LABMedical - Alterar Paciente',
        component: AddEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
