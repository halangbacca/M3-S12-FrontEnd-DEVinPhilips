import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Drug } from 'src/app/shared/models/Drug';
import { Patient } from 'src/app/shared/models/Patient';
import { DrugService } from 'src/app/shared/services/drug/drug.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';
import { DatePipe } from '@angular/common';
import { DrugRequest } from 'src/app/shared/models/DrugRequest';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-drug',
  templateUrl: './add-edit-drug.component.html',
  styleUrls: ['./add-edit-drug.component.scss'],
})
export class AddEditDrugComponent {
  drug = {} as Drug;
  patient = {} as Patient;
  id!: number;
  formDrug!: FormGroup;
  formPatient!: FormGroup;
  drugs = [] as Drug[];
  pacientes = [] as Patient[];
  isDisabled = true;
  isEditing = false;

  today!: Date;

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private drugService: DrugService,
    private router: Router,
    private rout: ActivatedRoute
  ) {}

  createform(drug: Drug) {
    this.formDrug = this.formBuilder.group({
      id: [drug.id],
      idPaciente: [drug.idPaciente],
      nomePaciente: [drug.nomePaciente, [Validators.required]],
      descricao: [
        drug.descricao,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      data: [drug.data, [Validators.required]],
      horario: [drug.horario, [Validators.required]],
      tipo: [drug.tipo, [Validators.required]],
      quantidade: [drug.quantidade, [Validators.required]],
      unidade: [drug.unidade, [Validators.required]],
      observacao: [
        drug.observacao,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      statusDoSistema: [true],
    });
  }

  createPatientForm() {
    this.formPatient = this.formBuilder.group({
      nomePaciente: ['', [Validators.required]],
      medicamento: [''],
    });
  }

  ngOnInit(): void {
    this.id = this.rout.snapshot.params['id'];

    this.createform(this.drug);
    this.createPatientForm();
    this.today = new Date();

    const hora =
      this.today.getHours() < 10
        ? `0${this.today.getHours()}`
        : `${this.today.getHours()}`;
    const minuto =
      this.today.getMinutes() < 10
        ? `0${this.today.getMinutes()}`
        : `${this.today.getMinutes()}`;
    const horaConsulta = `${hora}:${minuto}`;

    this.formDrug.patchValue({
      ...this.drug,
      data: new Date(),
      horario: horaConsulta,
    });

    this.patientService.getAllPatient().subscribe((ret) => {
      this.pacientes = ret;
    });

    this.formDrug.get('data')?.setValue(new Date());

    this.formDrug
      .get('horario')
      ?.setValue(formatDate(new Date(), 'H:mm', 'en'));
  }

  onFocus() {
    this.pacientes.forEach((patient) => {
      if (patient.nome === this.formDrug.get('nomePaciente')?.value) {
        this.formDrug.get('idPaciente')?.setValue(patient.id);
        this.formDrug.get('nomePaciente')?.setValue(patient.nome);
      }
    });

    if (this.formPatient.get('medicamento')?.value != null) {
      this.drugs.forEach((item) => {
        if (item.descricao === this.formPatient.get('medicamento')?.value) {
          this.formDrug.patchValue(item);
          this.isDisabled = false;
          this.isEditing = true;
        }
      });
    }
  }

  clearForm() {
    this.formDrug.reset();
    this.formPatient.reset();
    this.drug = {} as Drug;

    this.isDisabled = true;
    this.isEditing = false;

    this.formDrug
      .get('data')
      ?.setValue(formatDate(new Date(), 'dd-MM-yyyy', 'en'));

    this.formDrug
      .get('horario')
      ?.setValue(formatDate(new Date(), 'H:mm', 'en'));
  }

  saveDrug(drug: DrugRequest) {
    this.drugService.saveDrug(drug).subscribe(() => {
      this.notificationService.openSnackBar(
        'Medicamento cadastrado com sucesso!'
      );
      this.router.navigateByUrl('/home');
    });
  }

  updateDrug(drug: Drug) {
    this.drugService.updateDrug(drug).subscribe(() => {
      this.notificationService.openSnackBar(
        'Medicamento atualizado com sucesso!'
      );
      this.clearForm();
    });
  }

  editDrug() {
    const id = this.formDrug.get('id')?.value;
    const novoNome = this.formDrug.get('nome')?.value;
    const novaData = this.formDrug.get('data')?.value;
    const novoHorario = this.formDrug.get('horario')?.value;
    const novoTipo = this.formDrug.get('tipo')?.value;
    const novaQuantidade = this.formDrug.get('quantidade')?.value;
    const novaUnidade = this.formDrug.get('unidade')?.value;
    const novasObservacoes = this.formDrug.get('observacoes')?.value;

    if (this.formDrug.valid) {
      this.drugService.getDrug().subscribe((ret) => {
        ret.forEach((drug) => {
          if (drug.id === id) {
            drug.descricao = novoNome;
            drug.data = novaData;
            drug.horario = novoHorario;
            drug.tipo = novoTipo;
            drug.quantidade = novaQuantidade;
            drug.unidade = novaUnidade;
            drug.observacao = novasObservacoes;
            drug.situacao = true;
            this.updateDrug(drug);
          }
        });
      });
    }
  }

  deleteDrug() {
    if (this.formDrug.valid) {
      this.drugService
        .deleteDrug(this.formDrug.get('id')?.value)
        .subscribe(() => {
          this.notificationService.openSnackBar(
            'Medicamento deletado com sucesso!'
          );
        });

      this.clearForm();
    }
  }

  onSubmit() {
    if (this.formDrug.valid) {
      const dateValue = this.formDrug.get('data')?.value;
      const timeValue = this.formDrug.get('horario')?.value;

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

      const drug: DrugRequest = {
        ...this.formDrug.value,
        dtaMedicamento: formattedValue,
      };

      console.log(drug);
      return this.saveDrug(drug);
    }
  }
}
