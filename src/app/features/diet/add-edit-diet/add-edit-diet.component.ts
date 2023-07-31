import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Diet } from 'src/app/shared/models/Dieta';
import { Patient } from 'src/app/shared/models/Patient';
import { DietService } from 'src/app/shared/services/diet/diet.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';
import { ListLogsComponent } from '../../logs/list-logs/list-logs.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-drug',
  templateUrl: './add-edit-diet.component.html',
  styleUrls: ['./add-edit-diet.component.scss'],
})
export class AddEditDietComponent {
  diet = {} as Diet;
  patient = {} as Patient;

  dietaId = '';

  formDiet!: FormGroup;
  formPatient!: FormGroup;

  diets = [] as Diet[];
  pacientes = [] as Patient[];

  isDisabled = true;
  isEditing = false;

  paciente = {} as any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private dietService: DietService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  createform(diet: Diet) {
    this.formDiet = this.formBuilder.group({
      id: [diet.id],
      idPaciente: [diet.idPaciente],
      nomePaciente: ['', [Validators.required]],
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
    });
  }

  createPatientForm() {
    this.formPatient = this.formBuilder.group({
      nomePaciente: ['', [Validators.required]],
      dieta: [''],
    });
  }

  ngOnInit(): void {
    this.dietaId = this.route.snapshot.paramMap.get('id')!;

    if (this.dietaId != 'add') {
      this.createform(this.diet);
      this.createPatientForm();

      this.dietService.getDietById(parseInt(this.dietaId)).subscribe((ret) => {
        this.paciente = ret;
        this.formDiet.patchValue(ret);
        this.formDiet.get('idPaciente')?.setValue(this.paciente.paciente.id);
        this.formDiet
          .get('nomePaciente')
          ?.setValue(this.paciente.paciente.nome);
        const novaData = this.formDiet.get('dtaDieta')?.value.split(' ');
        this.formDiet.get('dtaDieta')?.setValue(novaData[0]);
        this.formDiet.get('horario')?.setValue(novaData[1]);
      });
      this.isDisabled = false;
      this.isEditing = true;
    } else {
      this.createform(this.diet);
      this.createPatientForm();

      this.patientService.getAllPatient().subscribe((ret) => {
        this.pacientes = ret;
      });

      this.formDiet
        .get('dtaDieta')
        ?.setValue(new Date().toLocaleDateString('en-GB'));

      this.formDiet
        .get('horario')
        ?.setValue(formatDate(new Date(), 'H:mm:ss', 'en'));
    }
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
          const novaData = item.dtaDieta.split(' ');
          this.formDiet.patchValue(item);
          this.formDiet.get('dtaDieta')?.setValue(novaData[0]);
          this.formDiet.get('horario')?.setValue(novaData[1]);
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
      ?.setValue(new Date().toLocaleDateString('en-GB'));

    this.formDiet
      .get('horario')
      ?.setValue(formatDate(new Date(), 'H:mm:ss', 'en'));
  }

  saveDiet(diet: Diet) {
    this.dietService.saveDiet(diet).subscribe(() => {
      this.notificationService.openSnackBar('Dieta cadastrada com sucesso!');
      this.clearForm();
      this.router.navigateByUrl('/home');
    });
  }

  updateDiet(diet: Diet) {
    this.dietService.updateDiet(diet).subscribe(() => {
      this.notificationService.openSnackBar('Dieta atualizada com sucesso!');
      this.router.navigate(['/dashboard']);
    });
  }

  editDiet() {
    const id = this.formDiet.get('id')?.value;
    const novoNome = this.formDiet.get('nomeDieta')?.value;
    const idPaciente = this.formDiet.get('idPaciente')?.value;
    const novaData = `${this.formDiet.get('dtaDieta')?.value} ${
      this.formDiet.get('horario')?.value
    }`;
    const novoTipo = this.formDiet.get('tipoDieta')?.value;
    const novaDescricao = this.formDiet.get('descricao')?.value;

    if (this.formDiet.valid) {
      this.dietService.getDiet().subscribe((ret) => {
        ret.forEach((diet) => {
          if (diet.id === id) {
            diet.idPaciente = idPaciente;
            diet.nomeDieta = novoNome;
            diet.dtaDieta = novaData;
            diet.tipoDieta = novoTipo;
            diet.descricao = novaDescricao;
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

      this.router.navigate(['/dashboard']);
    }
  }

  logs() {
    this.dialog.open(ListLogsComponent, {
      data: {
        tabLink: 'DIETA',
        codLink: this.formDiet.get('id')?.value,
      },
    });
  }

  onSubmit() {
    if (this.formDiet.valid && this.isEditing == false) {
      const novaData = `${this.formDiet.get('dtaDieta')?.value} ${
        this.formDiet.get('horario')?.value
      }`;
      this.formDiet.get('dtaDieta')?.setValue(novaData);
      return this.saveDiet(this.formDiet.value);
    }
  }
}
