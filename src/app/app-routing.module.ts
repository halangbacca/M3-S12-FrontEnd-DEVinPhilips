import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'customization',
    loadChildren: () =>
      import('./features/customization/customization.module').then(
        (m) => m.CustomizationModule
      ),
  },
  {
    path: 'drug',
    loadChildren: () =>
      import('./features/drug/drug.module').then(
        (m) => m.DrugModule
      ),
  },
  // {
  //   path: 'diet',
  //   loadChildren: () =>
  //     import('./features/diet/diet.module').then(
  //       (m) => m.DietModule
  //     ),
  // },
  // {
  //   path: 'exercise',
  //   loadChildren: () =>
  //     import('./features/exercise/exercise.module').then(
  //       (m) => m.ExerciseModule
  //     ),
  // },
  { path: 'patient',
    loadChildren: () => import('./features/patient/patient.module').then(m => m.PatientModule) },{
    path:'**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
