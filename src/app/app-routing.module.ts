import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module')
        .then((m) => m.DashboardModule),
  },
  {
    path: 'customization',
    loadChildren: () =>
      import('./features/customization/customization.module')
        .then((m) => m.CustomizationModule),
  },
  {
    path: 'diet',
    loadChildren: () =>
      import('./features/diet/diet.module')
        .then((m) => m.DietModule),
  },
  { path: 'patient',
    loadChildren: () =>
      import('./features/patient/patient.module')
        .then(m => m.PatientModule)
  },
  { path: 'appointment', loadChildren: () =>
      import('./features/appointment/appointment.module')
        .then(m => m.AppointmentModule)
  },{
    path:'**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
