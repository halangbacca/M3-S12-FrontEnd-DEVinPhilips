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
    path: 'medical-record',
    loadChildren: () =>
      import('./features/medical-record/medical-record.module').then(
        (m) => m.MedicalRecordModule
      ),
  },
  {
    path: 'diet',
    loadChildren: () =>
      import('./features/diet/diet.module').then((m) => m.DietModule),
  },
  {
    path: 'exercise',
    loadChildren: () =>
      import('./features/exercise/exercise.module').then(
        (m) => m.ExerciseModule
      ),
  },
  {
    path: 'drug',
    loadChildren: () =>
      import('./features/drug/drug.module').then((m) => m.DrugModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./features/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'patient',
    loadChildren: () =>
      import('./features/patient/patient.module').then((m) => m.PatientModule),
  },
  {
    path: 'appointment',
    loadChildren: () =>
      import('./features/appointment/appointment.module').then(
        (m) => m.AppointmentModule
      ),
  },
  {
    path: 'appointment',
    loadChildren: () =>
      import('./features/appointment/appointment.module').then(
        (m) => m.AppointmentModule
      ),
  },
  {
    path: 'exam',
    loadChildren: () =>
      import('./features/exam/exam.module').then((m) => m.ExamModule),
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
