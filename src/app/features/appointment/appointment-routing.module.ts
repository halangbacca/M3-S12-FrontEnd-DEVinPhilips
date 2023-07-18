import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditAppointment } from './add-edit/add-edit-appointment.component';
import { LayoutComponent } from "../../shared/layout/layout.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'add',
        title: 'LABMedical - Cadastrar Consulta',
        component : AddEditAppointment
      },
      {
        path: 'edit/:id',
        title: 'LABMedical - Editar Consulta',
        component: AddEditAppointment
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
