import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Exercise } from 'src/app/shared/models/Exercicio';
import { Patient } from 'src/app/shared/models/Patient';
import { ExerciseService } from 'src/app/shared/services/exercise/exercise.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';

@Component({
  selector: 'app-add-edit-exercise',
  templateUrl: './add-edit-exercise.component.html',
  styleUrls: ['./add-edit-exercise.component.scss'],
})
export class AddEditExerciseComponent {
  exercise = {} as Exercise;

  patient = {} as Patient;

  formExercise!: FormGroup;

  exercises = [] as Exercise[];

  pacientes = [] as Patient[];

  isDisabled = true;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private exerciseService: ExerciseService
  ) {}

  createform(exercise: Exercise) {
    this.formExercise = this.formBuilder.group({
      id: [exercise.id],
      exercicio: [exercise.nome],
      idPaciente: [exercise.idPaciente],
      nomePaciente: [exercise.nomePaciente, [Validators.required]],
      nome: [
        exercise.nome,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      data: [exercise.data, [Validators.required]],
      horario: [exercise.horario, [Validators.required]],
      tipo: [exercise.tipo, [Validators.required]],
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

  ngOnInit(): void {
    this.createform(this.exercise);

    this.patientService.getAllPatient().subscribe((ret) => {
      this.pacientes = ret;
    });

    this.formExercise
      .get('data')
      ?.setValue(new Date(Date.now()).toLocaleString());

    this.formExercise
      .get('horario')
      ?.setValue(new Date(Date.now()).toLocaleString());
  }

  onFocus() {
    this.patientService.getAllPatient().subscribe((ret) => {
      this.pacientes = ret;
    });

    this.exerciseService
      .getExerciseByPatientName(this.formExercise.get('nomePaciente')?.value)
      .subscribe((ret) => {
        this.exercises = ret;
      });

    this.pacientes.forEach((patient) => {
      if (patient.nome === this.formExercise.get('nomePaciente')?.value) {
        this.formExercise.get('idPaciente')?.setValue(patient.id);
      }
    });

    if (this.formExercise.get('exercicio')?.value != null) {
      this.exercises.forEach((item) => {
        if (item.nome === this.formExercise.get('exercicio')?.value) {
          this.formExercise.patchValue(item);
        }
        this.isDisabled = false;
        this.isEditing = true;
      });
    }
  }

  clearForm() {
    this.formExercise.reset();
    this.exercise = {} as Exercise;

    this.isDisabled = true;
    this.isEditing = false;

    this.formExercise
      .get('data')
      ?.setValue(new Date(Date.now()).toLocaleString());

    this.formExercise
      .get('horario')
      ?.setValue(new Date(Date.now()).toLocaleString());
  }

  saveExercise(exercise: Exercise) {
    this.exercises.forEach((item) => {
      if (item.id === exercise.id) {
        this.notificationService.openSnackBar('Exercício já cadastrado!');
      }
    });
    this.exerciseService.saveExercise(exercise).subscribe(() => {
      this.notificationService.openSnackBar(
        'Exercício cadastrado com sucesso!'
      );
      this.clearForm();
    });
  }

  updateExercise(exercise: Exercise) {
    this.exerciseService.updateExercise(exercise).subscribe(() => {
      this.notificationService.openSnackBar(
        'Exercício atualizado com sucesso!'
      );
      this.clearForm();
    });
  }

  editExercise() {
    const id = this.formExercise.get('id')?.value;
    const novoNome = this.formExercise.get('nome')?.value;
    const novaData = this.formExercise.get('data')?.value;
    const novoHorario = this.formExercise.get('horario')?.value;
    const novoTipo = this.formExercise.get('tipo')?.value;
    const novaQtd = this.formExercise.get('qtdSemana')?.value;
    const novaDescricao = this.formExercise.get('descricao')?.value;

    if (this.formExercise.valid) {
      this.exerciseService.getExercise().subscribe((ret) => {
        ret.forEach((exercise) => {
          if (exercise.id === id) {
            exercise.nome = novoNome;
            exercise.data = novaData;
            exercise.horario = novoHorario;
            exercise.tipo = novoTipo;
            exercise.qtdSemana = novaQtd;
            exercise.descricao = novaDescricao;
            exercise.statusDoSistema = true;
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

      this.clearForm();
    }
  }

  onSubmit() {
    if (this.formExercise.valid) {
      return this.saveExercise(this.formExercise.value);
    }
  }
}
