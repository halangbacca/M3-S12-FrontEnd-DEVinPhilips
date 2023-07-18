import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Drug } from 'src/app/shared/models/Drug';
import { Patient } from 'src/app/shared/models/Patient';
import { DrugService } from 'src/app/shared/services/drug/drug.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';

@Component({
  selector: 'app-add-edit-drug',
  templateUrl: './add-edit-drug.component.html',
  styleUrls: ['./add-edit-drug.component.scss'],
})
export class AddEditDrugComponent {
  drug = {} as Drug;

  patient = {} as Patient;

  formDrug!: FormGroup;

  drugs = [] as Drug[];

  pacientes = [] as Patient[];

  isDisabled = true;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private drugService: DrugService
  ) {}

  createform(drug: Drug) {
    this.formDrug = this.formBuilder.group({
      id: [drug.id],
      medicamento: [drug.nome],
      idPaciente: [drug.idPaciente],
      nomePaciente: [drug.nomePaciente],
      nome: [
        drug.nome,
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
      observacoes: [drug.observacoes, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.createform(this.drug);

    this.patientService.getAllPatient().subscribe((ret) => {
      this.pacientes = ret;
    });

    this.formDrug.get('data')?.setValue(new Date(Date.now()).toLocaleString());

    this.formDrug
      .get('horario')
      ?.setValue(new Date(Date.now()).toLocaleString());
  }

  onFocus() {
    this.patientService.getAllPatient().subscribe((ret) => {
      this.pacientes = ret;
    });

    this.drugService
      .getDrugByPatientName(this.formDrug.get('nomePaciente')?.value)
      .subscribe((ret) => {
        this.drugs = ret;
      });

    this.pacientes.forEach((patient) => {
      if (patient.nome === this.formDrug.get('nomePaciente')?.value) {
        this.formDrug.get('idPaciente')?.setValue(patient.id);
      }
    });

    if (this.formDrug.get('medicamento')?.value != null) {
      this.drugs.forEach((item) => {
        if (item.nome === this.formDrug.get('medicamento')?.value) {
          this.formDrug.patchValue(item);
        }
        this.isDisabled = false;
      });
    }
  }

  clearForm() {
    this.formDrug.reset();
    this.drug = {} as Drug;
  }

  saveDrug(drug: Drug) {
    this.drugs.forEach((item) => {
      if (item.id === drug.id) {
        this.notificationService.openSnackBar('Medicamento já cadastrado!');
      }
    });
    this.drugService.saveDrug(drug).subscribe(() => {
      this.notificationService.openSnackBar(
        'Medicamento cadastrado com sucesso!'
      );
      this.clearForm();
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
            drug.nome = novoNome;
            drug.data = novaData;
            drug.horario = novoHorario;
            drug.tipo = novoTipo;
            drug.quantidade = novaQuantidade;
            drug.unidade = novaUnidade;
            drug.observacoes = novasObservacoes;
            drug.statusDoSistema = true;
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
      return this.saveDrug(this.formDrug.value);
    }
  }
}
