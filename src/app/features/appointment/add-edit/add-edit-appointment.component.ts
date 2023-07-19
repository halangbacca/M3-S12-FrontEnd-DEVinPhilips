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
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { DeleteDialogComponent } from "./components/delete-dialog/delete-dialog.component";

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
  today!: Date;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe,
    private rout: ActivatedRoute,
    public dialog: MatDialog
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
      precaucao: ['',
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
      this.loading = true;
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
      this.loading = false;
    } else {
      this.today = new Date();

      const horaConsulta = `${this.today.getHours()}:${this.today.getMinutes()}`

      this.addEditAppointmentForm.patchValue({
        dtaConsulta: this.today,
        horaConsulta: horaConsulta
      });
    }
  }

  setPatient(id: number, nome: string) {
      this.selectedPatient = {
        id : id,
        nome : nome
      }
  }
  onSubmit() {
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

  openConfirmDialog(): void {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { ...this.addEditAppointmentForm.value }
    });

    confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.onSubmit();
        } else {
          this._snackBar.open(
            `Operação cancelada.`,
            'OK',
            { duration: 3000 }
          );
        }
      });
  }

  deleteAppointment() {
    const confirmDeleteDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: this.selectedPatient.nome
    });

    console.log(this.selectedPatient)

    confirmDeleteDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.patientService.deletePatient(this.id)
            .subscribe(() => {
              this._snackBar.open(
                `Cadastro excluído com sucesso.`,
                'OK',
                {duration: 3000}
              )
              this.router.navigateByUrl('/home');
            })
        }
      });
  }

}
