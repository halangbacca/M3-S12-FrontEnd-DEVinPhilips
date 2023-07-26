import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Diet } from 'src/app/shared/models/Dieta';
import { Patient } from 'src/app/shared/models/Patient';
import { DietService } from 'src/app/shared/services/diet/diet.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';

@Component({
  selector: 'app-add-edit-drug',
  templateUrl: './add-edit-diet.component.html',
  styleUrls: ['./add-edit-diet.component.scss'],
})
export class AddEditDietComponent {
  diet = {} as Diet;
  patient = {} as Patient;

  formDiet!: FormGroup;
  formPatient!: FormGroup;

  diets = [] as Diet[];
  pacientes = [] as Patient[];

  isDisabled = true;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private dietService: DietService
  ) {}

  createform(diet: Diet) {
    this.formDiet = this.formBuilder.group({
      id: [diet.id],
      idPaciente: [diet.idPaciente],
      nomePaciente: [diet.nomePaciente, [Validators.required]],
      nomeDieta: [
        diet.nomeDieta,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      dtaDieta: [diet.dtaDieta, [Validators.required]],
      horario: [diet.horario, [Validators.required]],
      tipoDieta: [diet.tipoDieta, [Validators.required]],
      descricao: [
        diet.descricao,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      situacao: [true],
    });
  }

  createPatientForm() {
    this.formPatient = this.formBuilder.group({
      nomePaciente: ['', [Validators.required]],
      dieta: [''],
    });
  }

  ngOnInit(): void {
    this.createform(this.diet);
    this.createPatientForm();

    this.patientService.getAllPatient().subscribe((ret) => {
      this.pacientes = ret;
    });

    this.formDiet
      .get('dtaDieta')
      ?.setValue(formatDate(new Date(), 'dd-MM-yyyy', 'en'));

    this.formDiet
      .get('horario')
      ?.setValue(formatDate(new Date(), 'H:mm:ss', 'en'));
  }

  onFocus() {
    if (this.formPatient.get('nomePaciente')?.value != null) {
      this.patientService.getAllPatient().subscribe((ret) => {
        this.pacientes = ret;

        this.dietService
          .getDietByPatientName(this.formPatient.get('nomePaciente')?.value)
          .subscribe((ret) => {
            this.diets = ret;
          });
      });
    }

    this.pacientes.forEach((patient) => {
      if (patient.nome === this.formPatient.get('nomePaciente')?.value) {
        this.formDiet.get('idPaciente')?.setValue(patient.id);
        this.formDiet.get('nomePaciente')?.setValue(patient.nome);
      }
    });

    if (this.formPatient.get('dieta')?.value != null) {
      this.diets.forEach((item) => {
        if (item.nomeDieta === this.formPatient.get('dieta')?.value) {
          this.formDiet.patchValue(item);
          this.isDisabled = false;
          this.isEditing = true;
        }
      });
    }
  }

  clearForm() {
    this.formDiet.reset();
    this.formPatient.reset();
    this.diet = {} as Diet;

    this.isDisabled = true;
    this.isEditing = false;

    this.formDiet
      .get('dtaDieta')
      ?.setValue(formatDate(new Date(), 'dd-MM-yyyy', 'en'));

    this.formDiet
      .get('horario')
      ?.setValue(formatDate(new Date(), 'H:mm:ss', 'en'));
  }

  saveDiet(diet: Diet) {
    this.dietService.saveDiet(diet).subscribe(() => {
      this.notificationService.openSnackBar('Dieta cadastrada com sucesso!');
      this.clearForm();
    });
  }

  updateDiet(diet: Diet) {
    this.dietService.updateDiet(diet).subscribe(() => {
      this.notificationService.openSnackBar('Dieta atualizada com sucesso!');
      this.clearForm();
    });
  }

  editDiet() {
    const id = this.formDiet.get('id')?.value;
    const novoNome = this.formDiet.get('nomeDieta')?.value;
    const novaData = this.formDiet.get('dtaDieta')?.value;
    const novoHorario = this.formDiet.get('horario')?.value;
    const novoTipo = this.formDiet.get('tipoDieta')?.value;
    const novaDescricao = this.formDiet.get('descricao')?.value;

    if (this.formDiet.valid) {
      this.dietService.getDiet().subscribe((ret) => {
        ret.forEach((diet) => {
          if (diet.id === id) {
            diet.nomeDieta = novoNome;
            diet.dtaDieta = novaData;
            diet.horario = novoHorario;
            diet.tipoDieta = novoTipo;
            diet.descricao = novaDescricao;
            diet.situacao = true;
            this.updateDiet(diet);
          }
        });
      });
    }
  }

  deleteDiet() {
    if (this.formDiet.valid) {
      this.dietService
        .deleteDiet(this.formDiet.get('id')?.value)
        .subscribe(() => {
          this.notificationService.openSnackBar('Dieta deletada com sucesso!');
        });

      this.clearForm();
    }
  }

  onSubmit() {
    if (this.formDiet.valid) {
      return this.saveDiet(this.formDiet.value);
    }
  }
}
