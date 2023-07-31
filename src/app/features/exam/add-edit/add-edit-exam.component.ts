import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Patient } from '@shared/models/Patient';
import { map, Observable, startWith } from 'rxjs';
import { PatientService } from '@services/patient';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ExamService } from '../../../shared/services/exam/exam.service';
import { ExamRequest } from '../../../shared/models/ExamRequest';
import { ExamDeleteDialogComponent } from './components/delete-dialog/exam-delete-dialog.component';
import { ExamConfirmDialogComponent } from './components/confirm-dialog/exam-confirm-dialog.component';
import { ListLogsComponent } from '../../logs/list-logs/list-logs.component';

export interface SelectedPatient {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-exam',
  templateUrl: './add-edit-exam.component.html',
  styleUrls: ['./add-edit-exam.component.scss'],
})
export class AddEditExamComponent implements OnInit {
  addEditExamForm!: FormGroup;
  id!: number;
  patients = [] as Patient[];
  patientControl = new FormControl('', Validators.required);
  filteredPatient!: Observable<Patient[]>;
  selectedPatient = {} as SelectedPatient;
  submitting = false;
  loading = false;
  editing = false;
  today!: Date;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private exameService: ExamService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe,
    private rout: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.patientService
      .getAllPatient()
      .subscribe((patients: Patient[]) => (this.patients = patients));
  }

  private _filteredPatient(value: string): Patient[] {
    const filterValue = value.toLowerCase();
    return this.patients.filter((patient: Patient) =>
      patient.nome.toLowerCase().includes(filterValue)
    );
  }
  ngOnInit() {
    this.id = this.rout.snapshot.params['id'];

    this.addEditExamForm = this.fb.group({
      descricao: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ]),
      ],
      dtaExame: ['', Validators.required],
      horaExame: ['', Validators.required],
      tipo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
        ]),
      ],
      laboratorio: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
        ]),
      ],
      documento: [''],
      resultado: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(1024),
        ]),
      ],
    });

    this.filteredPatient = this.patientControl.valueChanges.pipe(
      startWith(''),
      map((patient) =>
        patient ? this._filteredPatient(patient) : this.patients.slice()
      )
    );

    if (this.id) {
      this.loading = true;
      this.editing = true;
      this.exameService.getExamById(this.id).subscribe({next: (exam) => {
        const dataHoraExame = exam.dtaExame.split(' ');

        const dataHoraExamePartes = dataHoraExame[0].split('/');
        const diaExame = Number(dataHoraExamePartes[0]);
        const mesExame = Number(dataHoraExamePartes[1]);
        const anoExame = Number(dataHoraExamePartes[2]);

        const dataExameObject = new Date(anoExame, mesExame, diaExame);

        const horaExameString = dataHoraExame[1];
        const horaExamePartes = horaExameString.split(':');
        const horaExame = Number(horaExamePartes[0]);
        const minutoExame = Number(horaExamePartes[1]);
        const stringHoraExame =
          horaExame < 10 ? `0${horaExame}` : `${horaExame}`;
        const stringMinutoExame =
          minutoExame < 10 ? `0${minutoExame}` : `${minutoExame}`;
        const tempoExame = `${stringHoraExame}:${stringMinutoExame}`;

        this.addEditExamForm.patchValue({
          ...exam,
          dtaExame: dataExameObject,
          horaExame: tempoExame,
        });

        this.selectedPatient = {
          id: exam.paciente.id,
          nome: exam.paciente.nome,
        }
        this.loading = false;
      }, error: () => {
          this.loading = false;
          this.router.navigateByUrl("/dashboard")
        }
      });
    } else {
      this.today = new Date();
      const hora =
        this.today.getHours() < 10
          ? `0${this.today.getHours()}`
          : `${this.today.getHours()}`;
      const minuto =
        this.today.getMinutes() < 10
          ? `0${this.today.getMinutes()}`
          : `${this.today.getMinutes()}`;

      const horaExame = `${hora}:${minuto}`;

      this.addEditExamForm.patchValue({
        dtaExame: this.today,
        horaExame: horaExame,
      });
    }
  }

  setPatient(id: number, nome: string) {
    this.selectedPatient = {
      id: id,
      nome: nome,
    };
  }
  saveAppointment() {
    const dateValue = this.addEditExamForm.get('dtaExame')?.value;
    const timeValue = this.addEditExamForm.get('horaExame')?.value;

    const date = new Date(dateValue);
    const time = new Date(`2000-01-01T${timeValue}`);

    const combinedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );

    const formattedValue = this.datePipe.transform(
      combinedDate,
      'dd/MM/yyyy HH:mm:ss'
    );

    const exam: ExamRequest = {
      ...this.addEditExamForm.value,
      dtaExame: formattedValue,
      idPaciente: this.selectedPatient.id,
    };

    if (this.editing) {
      exam.id = this.id;
      this.exameService.updateExam(exam).subscribe(() => {
        this._snackBar.open(
          `Exame de ${this.selectedPatient.nome} editada com sucesso.`,
          'OK',
          { duration: 5000 }
        );
        this.submitting = false;
        this.router.navigateByUrl('/dashboard');
      });
    } else {
      this.exameService.saveExam(exam).subscribe(() => {
        this._snackBar.open(
          `Exame de ${this.selectedPatient.nome} cadastrada com sucesso.`,
          'OK',
          { duration: 5000 }
        );
        this.submitting = false;
        this.router.navigateByUrl('/dashboard');
      });
    }
  }

  openConfirmDialog(): void {
    const formValue = this.addEditExamForm.value;

    const confirmDialogRef = this.dialog.open(ExamConfirmDialogComponent, {
      data: {
        ...formValue,
        nomeDoPaciente: this.selectedPatient.nome,
      },
    });

    confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveAppointment();
      } else {
        this._snackBar.open(`Operação cancelada.`, 'OK', { duration: 5000 });
      }
    });
  }

  logs() {
    this.dialog.open(ListLogsComponent, {
      data: {
        tabLink: 'EXAME',
        codLink: this.id,
      },
    });
  }

  deleteExam() {
    const confirmDeleteDialogRef = this.dialog.open(ExamDeleteDialogComponent, {
      data: this.selectedPatient.nome,
    });

    confirmDeleteDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.patientService.deletePatient(this.id).subscribe(() => {
          this._snackBar.open(`Exame excluído com sucesso.`, 'OK', {
            duration: 3000,
          });
          this.router.navigateByUrl('/dashboard');
        });
      }
    });
  }
}
