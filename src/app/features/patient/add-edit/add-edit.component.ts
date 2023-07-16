import { Component } from '@angular/core';
import { Patient } from '@shared/models/Patient';
import { Cep } from '@shared/models/Cep';
import { PatientService } from '@services/patient';
import { CepService } from '@services/cep';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Consult } from "../../../shared/models/Consult";
import { Exam } from "../../../shared/models/Exam";
import { ConsultService } from "../../../shared/services/consult/consult.service";
import { ExamService } from "../../../shared/services/exam/exam.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { DeleteDialogComponent } from "./components/delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent {
  patientForm!: FormGroup;
  id!: number;
  patient: Patient = {} as Patient;
  title!: string;
  editing = false;
  loading = false;
  submitting = false;
  address: Cep = {} as Cep;

  today!: Date;

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private examService: ExamService,
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
      cep: [null, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8)])
      ],
      estado: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      cidade: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      pontoReferencia: [''],
      alergias: this.fb.array([
        this.fb.group({descricao: ['']})
      ]),
      naturalidade: ['', Validators.required],
      dtaNascimento: ['', Validators.required],
      nroCpf: ['', Validators.compose([
        Validators.required,
        ValidateCPF
      ])],
      email: ['', Validators.email],
      telefoneEmergencia: ['', Validators.required],
      genero: ['', Validators.required],
      nroCarteira: [''],
      convenio: [''],
      estadoCivil: ['', Validators.required],
      nome: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ])],
      telefone: ['', Validators.required],
      nroRg: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(20)
      ])],
      precaucoes: this.fb.array([
        this.fb.group({descricao: ['']})
      ]),
      dtaValidade: ['']
    });

    if (this.id) {
      this.loading = true;
      this.patientService.getPatientById(this.id)
        .subscribe(patient => {
          this.patientForm.patchValue(patient);
          this.title = `Editando o cadastro de ${patient.nome}`;
          this.loading = false;
        })
      this.editing = true;
    } else {
      this.title = "Preencha os campos para cadastrar";
    }
  }

  openConfirmDialog(): void {
    this.patient = this.patientForm.value;
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { ...this.patient }
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

  onSubmit(): void {
    this.submitting = true;
    const dtaNascimentoSelecionada: string = this.patientForm.get('dtaNascimento')?.value;
    const dtaNascimentoDateObject: Date = new Date(dtaNascimentoSelecionada);
    const datNascimentoFormatada: string = this.formatDate(dtaNascimentoDateObject);

    const dtaValidadeSelecionada: string = this.patientForm.get('dtaValidade')?.value;
    const dtaValidadeDateObject: Date = new Date(dtaValidadeSelecionada);
    const datValidadeFormatada: string = this.formatDate(dtaNascimentoDateObject);

    const updatedPatientForm = {
      ...this.patientForm.value,
      dtaNascimento: datNascimentoFormatada,
      dtaValidade: datValidadeFormatada
    }

    if (!this.editing) {
      this.patientService.savePatient(updatedPatientForm)
        .subscribe(newPatient => {
          this._snackBar.open(
            `${newPatient.nome} adiconado com sucesso.`,
            'OK',
            { duration: 3000 }
          );
          this.submitting = false;
          this.router.navigateByUrl('/home');
        })
    } else {
      this.patientService.updatePatient(updatedPatientForm)
        .subscribe(editedPerson => {
          this._snackBar.open(
            `Dados de ${editedPerson.nome} editado com sucesso.`,
            'OK',
            { duration: 3000 }
          );
          this.submitting = false;
          this.router.navigateByUrl('/home');
        })
    }
  }

  deletePatient() {
    this.examService.getExamByPatientId(this.id)
      .subscribe(exams => {
        if (exams.length > 0) {
          alert('pessos possui exame ou consulta');
        } else {
          const confirmDeleteDialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {...this.patientForm.value}
          });
          confirmDeleteDialogRef.afterClosed()
            .subscribe(result => {
              if (result) {
                this.patientService.deletePatient(result.id)
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
      })
  }

  getAddressFromViaCep(cep: string) {
    if (cep !== "") {
      cep = cep.replace(/\D+/g,'')
      let validateCep = /^[0-9]{8}$/;
      if (validateCep.test(cep)) {
        this.cepService.getCep(cep)
          .subscribe(adress => {
            this.address = adress
            this.patientForm.patchValue({
              cidade: adress.localidade,
              estado: adress.uf,
              logradouro: adress.logradouro,
              bairro: adress.bairro
            })
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
      descricao: ['']
    })
    this.alergias.push(descricao);
  }

  removeAlergia(i: number) {
    if (this.alergias.length > 1)
    this.alergias.removeAt(i);
  }

  addPrecaucao() {
    const descricao = this.fb.group({
      descricao: ['']
    })
    this.precaucoes.push(descricao);
  }

  removePrecaucao(i: number) {
    if (this.precaucoes.length > 1)
    this.precaucoes.removeAt(i);
  }

  onClick(event: Event) {
    event.preventDefault()
  }

  private formatDate(date: Date): string {
    const day: string = ('0' + date.getDate()).slice(-2);
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2);
    const year: number = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  //Constantes
  GENEROS = [
    { genero: 'M', descricao: 'Masculino' },
    { genero: 'F', descricao: 'Feminino' },
  ];

  ESTADOCIVIL = [
    { estcivil: 'SOLTEIRO', descricao: 'Solteiro' },
    { estcivil: 'CASADO', descricao: 'Casado' },
    { estcivil: 'VIUVO', descricao: 'Viúvo' },
    { estcivil: 'DIVORCIADO', descricao: 'Divorciado' },
  ];
}

function ValidateCPF(control: AbstractControl): { [s: string]: boolean } | null {
  if (!control) {
    return { isValidCPF: false };
  }
  const cpf = control.value.replace(/\D+/g,'');
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
