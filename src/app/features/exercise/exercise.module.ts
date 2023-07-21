import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';

import { ReactiveFormsModule } from '@angular/forms';
import { AddEditExerciseComponent } from './add-edit-exercise/add-edit-exercise.component';
import { ExerciseRoutingModule } from './exercise-routing.module';

@NgModule({
  declarations: [AddEditExerciseComponent],
  imports: [
    CommonModule,
    ExerciseRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
})
export class ExerciseModule {}