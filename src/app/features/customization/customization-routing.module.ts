import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCompanyComponent } from './add-edit-company/add-edit-company.component';

const routes: Routes = [
  {
    path: '',
    component: AddEditCompanyComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomizationRoutingModule {}
