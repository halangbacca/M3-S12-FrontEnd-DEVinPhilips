import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'dashboard',
  loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
},
  { path: 'patient',
    loadChildren: () => import('./features/patient/patient.module').then(m => m.PatientModule) },{
  path:'**',
  redirectTo: 'dashboard',
  pathMatch: 'full',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
