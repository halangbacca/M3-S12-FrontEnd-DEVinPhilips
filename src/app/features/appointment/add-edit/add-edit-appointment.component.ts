import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Patient } from "@shared/models/Patient";
import { map, Observable, startWith } from "rxjs";
import { PatientService } from "@services/patient";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AppointmentService } from "../../../shared/services/appointment/appointment.service";
import { AppointmentRequest } from "../../../shared/models/AppointmentRequest";
import { DatePipe } from "@angular/common";

export interface SelectedPatient {
  id: number,
  nome: string
}

@Component({
  selector: 'app-appointment',
  templateUrl: './add-edit-appointment.component.html',
  styleUrls: ['./add-edit-appointment.component.scss']
})
export class AddEditAppointment implements OnInit {
  addEditAppointmentForm!: FormGroup;
  id!: number;
  patients = [] as Patient[];
  patientControl = new FormControl('');
  filteredPatient!: Observable<Patient[]>;
  selectedPatient = {} as SelectedPatient;
  submitting = false;
  loading = false;
  editing = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe,
    private rout: ActivatedRoute
  ) {
    this.patientService.getAllPatient()
      .subscribe((patients: Patient[]) =>
        this.patients = patients);
  }

  private _filteredPatient(value: string): Patient[] {
    const filterValue = value.toLowerCase();
    return this.patients.filter((patient: Patient) =>
      patient.nome.toLowerCase().includes(filterValue));
  }
  ngOnInit() {
    this.id = this.rout.snapshot.params['id'];

    this.addEditAppointmentForm = this.fb.group({
      motivo: ['',
        Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ])],
      dtaConsulta: ['', Validators.required],
      horaConsulta: ['', Validators.required],
      problema: ['',
        Validators.compose([
        Validators.required,
          Validators.minLength(16),
          Validators.maxLength(1024)
      ])],
      medicacao: '',
      precausao: ['',
        Validators.compose([
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(256)
      ])]
    })

    this.filteredPatient = this.patientControl.valueChanges.pipe(
      startWith(''),
      map(patient => (patient? this._filteredPatient(patient) : this.patients.slice()))
    )

    if (this.id) {
      this.editing = true;
      this.appointmentService.getAppointmentById(this.id)
        .subscribe(appointment => {

          const dataHoraConsulta = appointment.dtaConsulta.split(" ");

          const dataHoraConsultaPartes = dataHoraConsulta[0].split("/");
          const diaConsulta = Number(dataHoraConsultaPartes[0]);
          const mesConsulta = Number(dataHoraConsultaPartes[1]);
          const anoConsulta = Number(dataHoraConsultaPartes[2]);

          const dataConsultaObject = new Date(anoConsulta, mesConsulta, diaConsulta);

          const horaConsultaString = dataHoraConsulta[1];
          const horaConsultaPartes = horaConsultaString.split(":");
          const horaConsulta = Number(horaConsultaPartes[0]);
          const minutoConsulta = Number(horaConsultaPartes[1]);
          const tempoConsulta = `${horaConsulta}:${minutoConsulta}`;

            this.addEditAppointmentForm.patchValue({
              ...appointment,
              dtaConsulta: dataConsultaObject,
              horaConsulta: tempoConsulta
            })

          this.selectedPatient = {
            id: appointment.paciente.id,
            nome: appointment.paciente.nome
          }
        })
    }
  }

  setPatient(id: number, nome: string) {
      this.selectedPatient = {
        id : id,
        nome : nome
      }
  }
  saveAppointment() {
    const dateValue = this.addEditAppointmentForm.get('dtaConsulta')?.value;
    const timeValue = this.addEditAppointmentForm.get('horaConsulta')?.value;

    const date = new Date(dateValue);
    const time = new Date(`2000-01-01T${timeValue}`)

    const combinedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );

    const formattedValue = this.datePipe.transform(combinedDate, 'dd/MM/yyyy HH:mm:ss');

    console.log(this.selectedPatient)

    const appointment: AppointmentRequest = {
      ...this.addEditAppointmentForm.value,
      dtaConsulta : formattedValue,
      idPaciente : this.selectedPatient.id
    }

    if (this.editing) {
      appointment.id = this.id;
      this.appointmentService.updateAppointment(appointment)
        .subscribe(() => {
          this._snackBar.open(
            `Consulta de ${this.selectedPatient.nome} editada com sucesso.`,
            'OK',
            { duration: 3000 }
          );
          this.submitting = false;
          this.router.navigateByUrl('/home');
        })
    } else {
      this.appointmentService.saveAppointment(appointment)
        .subscribe(() => {
          this._snackBar.open(
            `Consulta de ${this.selectedPatient.nome} cadastrada com sucesso.`,
            'OK',
            { duration: 3000 }
          );
          this.submitting = false;
          this.router.navigateByUrl('/home');
        })
    }
  }
}
