import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { AddEditAppointment } from './add-edit/add-edit-appointment.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";


@NgModule({
  declarations: [
    AddEditAppointment
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  providers: [
    DatePipe
  ]
})
export class AppointmentModule { }
