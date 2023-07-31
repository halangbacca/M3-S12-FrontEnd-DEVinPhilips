import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { AddEditDietComponent } from './add-edit-diet/add-edit-diet.component';

const routes: Routes = [
  {
    path: '',
    title: 'LABMedical - Cadastrar Dieta',
    component: LayoutComponent,
    children: [{ path: '', component: AddEditDietComponent }],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DietRoutingModule {}
