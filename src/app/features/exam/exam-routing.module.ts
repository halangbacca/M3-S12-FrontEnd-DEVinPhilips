import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditExamComponent } from './add-edit/add-edit-exam.component';
import { LayoutComponent } from "../../shared/layout/layout.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'add',
        title: 'LABMedical - Cadastrar de exame',
        component: AddEditExamComponent
      },
      {
        path: 'edit/:id',
        title: 'LABMedical - Editar de exame',
        component: AddEditExamComponent
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
