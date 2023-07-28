import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'customization',
    loadChildren: () =>
      import('./features/customization/customization.module').then(
        (m) => m.CustomizationModule
      ),
  },
  {
    path: 'logs',
    loadChildren: () =>
      import('./features/logs/logs.module').then((m) => m.LogsModule),
  },
  {
    path: 'medical-record',
    loadChildren: () =>
      import('./features/medical-record/medical-record.module').then(
        (m) => m.MedicalRecordModule
      ),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'diet',
    loadChildren: () =>
      import('./features/diet/diet.module').then((m) => m.DietModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'exercise',
    loadChildren: () =>
      import('./features/exercise/exercise.module').then(
        (m) => m.ExerciseModule
      ),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'drug',
    loadChildren: () =>
      import('./features/drug/drug.module').then((m) => m.DrugModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./features/user/user.module').then((m) => m.UserModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'patient',
    loadChildren: () =>
      import('./features/patient/patient.module').then((m) => m.PatientModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'appointment',
    loadChildren: () =>
      import('./features/appointment/appointment.module').then((m) => m.AppointmentModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'appointment',
    loadChildren: () =>
      import('./features/appointment/appointment.module').then((m) => m.AppointmentModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'exam',
    loadChildren: () =>
      import('./features/exam/exam.module').then((m) => m.ExamModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
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
