import { Component, OnInit } from '@angular/core';
import { Patient } from '@shared/models/Patient';
import { Cep } from '@shared/models/Cep';
import { PatientService } from '@services/patient';
import { CepService } from '@services/cep';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ExamService } from '../../../shared/services/exam/exam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ListLogsComponent } from '../../logs/list-logs/list-logs.component';
import { AppointmentService } from "../../../shared/services/appointment/appointment.service";
import { DietService } from "../../../shared/services/diet/diet.service";
import { DrugService } from "../../../shared/services/drug/drug.service";
import { ExerciseService } from "../../../shared/services/exercise/exercise.service";
import { forkJoin, map, Observable } from "rxjs";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit-patient.component.html',
  styleUrls: ['./add-edit-patient.component.scss'],
})
export class AddEditPatient implements OnInit {
  patientForm!: FormGroup;
  id!: number;
  patient: Patient = {} as Patient;
  title!: string;
  editing = false;
  loading = false;
  submitting = false;
  address: Cep = {} as Cep;
  hasRegistry = false;

  today!: Date;

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private examService: ExamService,
    private appointmentService: AppointmentService,
    private dietService: DietService,
    private drugService: DrugService,
    private exerciseService: ExerciseService,
    private rout: ActivatedRoute,
    public dialog: MatDialog,
    private patientService: PatientService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.today = new Date();
  }

  ngOnInit() {
    this.id = this.rout.snapshot.params['id'];

    this.patientForm = this.fb.group({
      cep: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
        ]),
      ],
      estado: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      cidade: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      referencia: [''],
      alergias: this.fb.array([this.fb.group({ descricao: [''] })]),
      naturalidade: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ]),
      ],
      dtaNascimento: ['', Validators.required],
      cpf: ['', Validators.compose([Validators.required, ValidateCPF])],
      email: ['', Validators.email],
      telEmergencia: ['', Validators.required],
      genero: ['', Validators.required],
      nroConvenio: [''],
      convenio: [''],
      estadoCivil: ['', Validators.required],
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ]),
      ],
      telefone: ['', Validators.required],
      rg: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
      precaucoes: this.fb.array([this.fb.group({ descricao: [''] })]),
      validadeConvenio: [''],
    });

    if (this.id) {
      this.loading = true;
      this.patientService.getPatientById(this.id).subscribe({next: (patient) => {
        const dataNascimentoResponse = patient.dtaNascimento;
        const dataNascimentoPartes = dataNascimentoResponse.split('/');
        const diaNascimento = Number(dataNascimentoPartes[0]);
        const mesNascimento = Number(dataNascimentoPartes[1]);
        const anoNascimento = Number(dataNascimentoPartes[2]);

        const dataNascimentoObject = new Date(
          anoNascimento,
          mesNascimento,
          diaNascimento
        );

        const dataValidadeResponse = patient.validadeConvenio;

        let dataValidadePartes: string[];
        let dataValidadeObject: Date | null;

        if (dataValidadeResponse) {
          dataValidadePartes = dataValidadeResponse.split('/');
          const diaValidade = Number(dataValidadePartes[0]);
          const mesValidade = Number(dataValidadePartes[1]);
          const anoValidade = Number(dataValidadePartes[2]);

          dataValidadeObject = new Date(anoValidade, mesValidade, diaValidade);
        } else {
          dataValidadeObject = null;
        }

        for (let i = patient.alergias.length - 1; i > 0; i--) {
          this.addAlergia();
        }

        for (let i = patient.precaucoes.length - 1; i > 0; i--) {
          this.addPrecaucao();
        }

        this.patientForm.patchValue({
          ...patient,
          dtaNascimento: dataNascimentoObject,
          validadeConvenio: dataValidadeObject,
        });

        this.appointmentService.getAppointmentByPatientName(patient.nome)
          .subscribe(appointmentList => {
            if (appointmentList.length > 0) {
              this.setHasRegistry(true)
            }
          });

        this.exerciseService.getExerciseByPatientName(patient.nome)
          .subscribe(exerciseList => {
            if (exerciseList.length > 0) {
              this.setHasRegistry(true)
            }
          });

        this.examService.getExamByPatientNome(patient.nome)
          .subscribe(examList => {
            if (examList.length > 0) {
              this.setHasRegistry(true)
            }
          });

        this.drugService.getDrugByPatientName(patient.nome)
          .subscribe(drugList => {
            if (drugList.length > 0) {
              this.setHasRegistry(true)
            }
          });

        this.dietService.getDietByPatientName(patient.nome)
          .subscribe(dietlist => {
            if (dietlist.length > 0) {
              this.setHasRegistry(true)
            }
          });

        this.title = `Editando o cadastro de ${patient.nome}`;
        this.loading = false;
      },
        error: () => {
          this.loading = false;
          this.router.navigateByUrl("/home");
        }
    });
      this.editing = true;
    } else {
      this.title = 'Preencha os campos para cadastrar';
    }
  }

  openConfirmDialog(): void {
    this.patient = this.patientForm.value;
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { ...this.patient },
    });

    confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.setEditing(true);
      } else {
        this._snackBar.open(`Operação cancelada.`, 'OK', { duration: 3000 });
      }
    });
  }

  savePatient(): void {
    this.submitting = true;

    if (this.patientForm.get('dtaNascimento')?.value) {
      const dataNascimentoSeleciona =
        this.patientForm.get('dtaNascimento')?.value;
      const dataNascimentoObject: Date = new Date(dataNascimentoSeleciona);
      const dataNascimentoFormatada = this.formatDate(dataNascimentoObject);
      this.patientForm.patchValue({ dtaNascimento: dataNascimentoFormatada });
    }

    if (this.patientForm.get('validadeConvenio')?.value) {
      const validadeConvenioSelecionada =
        this.patientForm.get('validadeConvenio')?.value;
      const validadeConvenioObject: Date = new Date(
        validadeConvenioSelecionada
      );
      const validadeConvenioFormatada = this.formatDate(validadeConvenioObject);
      this.patientForm.patchValue({
        validadeConvenio: validadeConvenioFormatada,
      });
    }

    for (let i = this.alergias.length - 1; i >= 0; i--) {
      if (
        this.alergias.at(i).get('descricao')?.value == null ||
        this.alergias.at(i).get('descricao')?.value == ''
      ) {
        this.alergias.removeAt(i);
      }
    }

    for (let i = this.precaucoes.length - 1; i >= 0; i--) {
      if (
        this.precaucoes.at(i).get('descricao')?.value == null ||
        this.precaucoes.at(i).get('descricao')?.value == ''
      ) {
        this.precaucoes.removeAt(i);
      }
    }

    const updatedPatientForm = { ...this.patientForm.value };

    if (!this.editing) {
      this.patientService
        .savePatient(updatedPatientForm)
        .subscribe((newPatient) => {
          this._snackBar.open(
            `${newPatient.nome} adicionado com sucesso.`,
            'OK',
            { duration: 3000 }
          );
          this.submitting = false;
          this.router.navigateByUrl('/home');
        });
    } else {
      updatedPatientForm.id = this.id;
      this.patientService
        .updatePatient(updatedPatientForm)
        .subscribe((editedPerson) => {
          this._snackBar.open(
            `Dados de ${editedPerson.nome} editado com sucesso.`,
            'OK',
            { duration: 3000 }
          );
          this.submitting = false;
          this.router.navigateByUrl('/home');
        });
    }
  }

  deletePatient() {
    this.patient = this.patientForm.value;
    const confirmDeleteDialogRef = this.dialog.open(DeleteDialogComponent, {
        data: { ...this.patient },
      });
      confirmDeleteDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.patientService.deletePatient(this.id)
            .subscribe(
              (patientDeleted) => {
                this._snackBar.open(`Cadastro de ${patientDeleted.nome} excluído com sucesso.`, 'OK', {
                  duration: 5000,
                });
                this.router.navigateByUrl('/home');
              }
            );
        }
      });
    }

  getAddressFromViaCep(cep: string) {
    if (cep !== '') {
      cep = cep.replace(/\D+/g, '');
      let validateCep = /^[0-9]{8}$/;
      if (validateCep.test(cep)) {
        this.cepService.getCep(cep).subscribe((adress) => {
          this.address = adress;
          this.patientForm.patchValue({
            cidade: adress.localidade,
            estado: adress.uf,
            logradouro: adress.logradouro,
            bairro: adress.bairro,
          });
        });
      }
    }
  }

  get alergias() {
    return this.patientForm.get('alergias') as FormArray;
  }

  get precaucoes() {
    return this.patientForm.get('precaucoes') as FormArray;
  }

  addAlergia() {
    const descricao = this.fb.group({
      descricao: [''],
    });
    this.alergias.push(descricao);
  }

  removeAlergia(i: number) {
    if (this.alergias.length > 1) this.alergias.removeAt(i);
  }

  addPrecaucao() {
    const descricao = this.fb.group({
      descricao: [''],
    });
    this.precaucoes.push(descricao);
  }

  removePrecaucao(i: number) {
    if (this.precaucoes.length > 1) this.precaucoes.removeAt(i);
  }

  onClick(event: Event) {
    event.preventDefault();
  }

  logs() {
    this.dialog.open(ListLogsComponent, {
      data: {
        tabLink: 'PACIENTE',
        codLink: this.id,
      },
    });
  }

  private formatDate(date: Date): string {
    const day: string = ('0' + date.getDate()).slice(-2);
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2);
    const year: number = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  setHasRegistry(value: boolean): void {
    this.hasRegistry = value;
  }

  setEditing(value: boolean): void {
    this.editing = value;
  }

  GENEROS = [
    { genero: 'MASCULINO', descricao: 'Masculino' },
    { genero: 'FEMININO', descricao: 'Feminino' },
  ];

  ESTADOCIVIL = [
    { estcivil: 'SOLTEIRO', descricao: 'Solteiro(a)' },
    { estcivil: 'CASADO', descricao: 'Casado(a)' },
    { estcivil: 'VIUVO', descricao: 'Viúvo(a)' },
    { estcivil: 'DIVORCIADO', descricao: 'Divorciado(a)' },
  ];
}

function ValidateCPF(
  control: AbstractControl
): { [s: string]: boolean } | null {
  if (!control) {
    return { isValidCPF: false };
  }
  const cpf = control.value.replace(/\D+/g, '');
  if (cpf.length !== 11) {
    return { isValidCPF: false };
  }
  let sum = 0;
  let rest;
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) {
    rest = 0;
  }
  if (rest !== parseInt(cpf.substring(9, 10))) {
    return { isValidCPF: false };
  }
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) {
    rest = 0;
  }
  if (rest !== parseInt(cpf.substring(10, 11))) {
    return { isValidCPF: false };
  }
  return null;
}
