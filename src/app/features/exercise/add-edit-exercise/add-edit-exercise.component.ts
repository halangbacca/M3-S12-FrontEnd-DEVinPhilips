import { Component } from '@angular/core';

import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Exercise } from 'src/app/shared/models/Exercicio';
import { Patient } from 'src/app/shared/models/Patient';
import { ExerciseService } from 'src/app/shared/services/exercise/exercise.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { ListLogsComponent } from '../../logs/list-logs/list-logs.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-exercise',
  templateUrl: './add-edit-exercise.component.html',

  styleUrls: ['./add-edit-exercise.component.scss'],
})
export class AddEditExerciseComponent {
  exercise = {} as Exercise;
  patient = {} as Patient;

  exercicioId = '';

  formExercise!: FormGroup;
  formPatient!: FormGroup;

  exercises = [] as Exercise[];
  pacientes = [] as Patient[];

  isDisabled = true;
  isEditing = false;

  paciente = {} as any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private exerciseService: ExerciseService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  createform(exercise: Exercise) {
    this.formExercise = this.formBuilder.group({
      id: [exercise.id],
      idPaciente: [exercise.idPaciente],
      nomePaciente: ['', [Validators.required]],
      nomeExercicio: [
        exercise.nomeExercicio,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      dtaExercicio: [exercise.dtaExercicio, [Validators.required]],
      horario: ['', [Validators.required]],
      tipoExercicio: [exercise.tipoExercicio, [Validators.required]],
      qtdSemana: [exercise.qtdSemana, [Validators.required]],
      descricao: [
        exercise.descricao,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  createPatientForm() {
    this.formPatient = this.formBuilder.group({
      nomePaciente: ['', [Validators.required]],
      exercicio: [''],
    });
  }

  ngOnInit(): void {
    this.exercicioId = this.route.snapshot.paramMap.get('id')!;

    if (this.exercicioId != 'add') {
      this.createform(this.exercise);
      this.createPatientForm();

      this.exerciseService
        .getExerciseById(parseInt(this.exercicioId))
        .subscribe((ret) => {
          this.paciente = ret;
          this.formExercise.patchValue(ret);
          this.formExercise
            .get('idPaciente')
            ?.setValue(this.paciente.paciente.id);
          this.formExercise
            .get('nomePaciente')
            ?.setValue(this.paciente.paciente.nome);
          const novaData = this.formExercise
            .get('dtaExercicio')
            ?.value.split(' ');
          this.formExercise.get('dtaExercicio')?.setValue(novaData[0]);
          this.formExercise.get('horario')?.setValue(novaData[1]);
        });
      this.isDisabled = false;
      this.isEditing = true;
    } else {
      this.createform(this.exercise);
      this.createPatientForm();

      this.patientService.getAllPatient().subscribe((ret) => {
        this.pacientes = ret;
      });

      this.formExercise
        .get('dtaExercicio')
        ?.setValue(new Date().toLocaleDateString('en-GB'));

      this.formExercise
        .get('horario')
        ?.setValue(formatDate(new Date(), 'H:mm:ss', 'en'));
    }
  }

  onFocus() {
    if (this.formPatient.get('nomePaciente')?.value != null) {
      this.patientService.getAllPatient().subscribe((ret) => {
        this.pacientes = ret;

        this.exerciseService
          .getExerciseByPatientName(this.formPatient.get('nomePaciente')?.value)
          .subscribe((ret) => {
            this.exercises = ret;
          });
      });
    }

    this.pacientes.forEach((patient) => {
      if (patient.nome === this.formPatient.get('nomePaciente')?.value) {
        this.formExercise.get('idPaciente')?.setValue(patient.id);
        this.formExercise.get('nomePaciente')?.setValue(patient.nome);
      }
    });

    if (this.formPatient.get('exercicio')?.value != null) {
      this.exercises.forEach((item) => {
        if (item.nomeExercicio === this.formPatient.get('exercicio')?.value) {
          const novaData = item.dtaExercicio.split(' ');
          this.formExercise.patchValue(item);
          this.formExercise.get('dtaExercicio')?.setValue(novaData[0]);
          this.formExercise.get('horario')?.setValue(novaData[1]);
          this.isDisabled = false;
          this.isEditing = true;
        }
      });
    }
  }

  clearForm() {
    this.formExercise.reset();
    this.formPatient.reset();
    this.exercise = {} as Exercise;

    this.isDisabled = true;
    this.isEditing = false;

    this.formExercise
      .get('dtaExercicio')
      ?.setValue(new Date().toLocaleDateString('en-GB'));

    this.formExercise
      .get('horario')
      ?.setValue(formatDate(new Date(), 'H:mm:ss', 'en'));
  }

  saveExercise(exercise: Exercise) {
    this.exerciseService.saveExercise(exercise).subscribe(() => {
      this.notificationService.openSnackBar(
        'Exercício cadastrado com sucesso!'
      );
      this.clearForm();
      this.router.navigateByUrl('/home');
    });
  }

  updateExercise(exercise: Exercise) {
    this.exerciseService.updateExercise(exercise).subscribe(() => {
      this.notificationService.openSnackBar(
        'Exercício atualizado com sucesso!'
      );
      this.router.navigate(['/dashboard']);
    });
  }

  editExercise() {
    console.log(this.formExercise);
    const id = this.formExercise.get('id')?.value;
    const novoNome = this.formExercise.get('nomeExercicio')?.value;
    const idPaciente = this.formExercise.get('idPaciente')?.value;
    const novaData = `${this.formExercise.get('dtaExercicio')?.value} ${
      this.formExercise.get('horario')?.value
    }`;
    const novoTipo = this.formExercise.get('tipoExercicio')?.value;
    const novaQtd = this.formExercise.get('qtdSemana')?.value;
    const novaDescricao = this.formExercise.get('descricao')?.value;

    if (this.formExercise.valid) {
      this.exerciseService.getExercise().subscribe((ret) => {
        ret.forEach((exercise) => {
          if (exercise.id === id) {
            exercise.idPaciente = idPaciente;
            exercise.nomeExercicio = novoNome;
            exercise.dtaExercicio = novaData;
            exercise.tipoExercicio = novoTipo;
            exercise.qtdSemana = novaQtd;
            exercise.descricao = novaDescricao;
            this.updateExercise(exercise);
          }
        });
      });
    }
  }

  deleteExercise() {
    if (this.formExercise.valid) {
      this.exerciseService
        .deleteExercise(this.formExercise.get('id')?.value)
        .subscribe(() => {
          this.notificationService.openSnackBar(
            'Exercício deletado com sucesso!'
          );
        });

      this.router.navigate(['/dashboard']);
    }
  }

  logs() {
    this.dialog.open(ListLogsComponent, {
      data: {
        tabLink: 'EXERCICIO',
        codLink: this.formExercise.get('id')?.value,
      },
    });
  }

  onSubmit() {
    if (this.formExercise.valid && this.isEditing == false) {
      const novaData = `${this.formExercise.get('dtaExercicio')?.value} ${
        this.formExercise.get('horario')?.value
      }`;
      this.formExercise.get('dtaExercicio')?.setValue(novaData);
      return this.saveExercise(this.formExercise.value);
    }
  }
}
