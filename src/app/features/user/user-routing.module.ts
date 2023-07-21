import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

const routes: Routes = [
  {
    path: 'add',
    component: LayoutComponent,
    children: [{ path: '', component: AddEditUserComponent }],
    
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
