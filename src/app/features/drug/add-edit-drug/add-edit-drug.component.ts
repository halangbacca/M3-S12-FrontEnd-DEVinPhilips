import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Drug } from 'src/app/shared/models/Drug';
import { Patient } from 'src/app/shared/models/Patient';
import { DrugService } from 'src/app/shared/services/drug/drug.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';
import { ListLogsComponent } from '../../logs/list-logs/list-logs.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-drug',
  templateUrl: './add-edit-drug.component.html',
  styleUrls: ['./add-edit-drug.component.scss'],
})
export class AddEditDrugComponent {
  drug = {} as Drug;
  patient = {} as Patient;

  medicamentoId = '';

  formDrug!: FormGroup;
  formPatient!: FormGroup;

  drugs = [] as Drug[];
  pacientes = [] as Patient[];

  isDisabled = true;
  isEditing = false;

  paciente = {} as any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private drugService: DrugService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  createform(drug: Drug) {
    this.formDrug = this.formBuilder.group({
      id: [drug.id],
      idPaciente: [drug.idPaciente],
      nomePaciente: ['', [Validators.required]],
      descricao: [
        drug.descricao,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      dtaMedicamento: [drug.dtaMedicamento, [Validators.required]],
      horario: ['', [Validators.required]],
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
    });
  }

  createPatientForm() {
    this.formPatient = this.formBuilder.group({
      nomePaciente: ['', [Validators.required]],
      medicamento: [''],
    });
  }

  ngOnInit(): void {
    this.medicamentoId = this.route.snapshot.paramMap.get('id')!;

    if (this.medicamentoId != 'add') {
      this.createform(this.drug);
      this.createPatientForm();

      this.drugService
        .getDrugById(parseInt(this.medicamentoId))
        .subscribe((ret) => {
          this.paciente = ret;
          this.formDrug.patchValue(ret);
          this.formDrug.get('idPaciente')?.setValue(this.paciente.paciente.id);
          this.formDrug
            .get('nomePaciente')
            ?.setValue(this.paciente.paciente.nome);
          const novaData = this.formDrug
            .get('dtaMedicamento')
            ?.value.split(' ');
          this.formDrug.get('dtaMedicamento')?.setValue(novaData[0]);
          this.formDrug.get('horario')?.setValue(novaData[1]);
        });
      this.isDisabled = false;
      this.isEditing = true;
    } else {
      this.createform(this.drug);
      this.createPatientForm();

      this.patientService.getAllPatient().subscribe((ret) => {
        this.pacientes = ret;
      });

      this.formDrug
        .get('dtaMedicamento')
        ?.setValue(new Date().toLocaleDateString('en-GB'));

      this.formDrug
        .get('horario')
        ?.setValue(formatDate(new Date(), 'H:mm:ss', 'en'));
    }
  }

  onFocus() {
    if (this.formPatient.get('nomePaciente')?.value != null) {
      this.patientService.getAllPatient().subscribe((ret) => {
        this.pacientes = ret;

        this.drugService
          .getDrugByPatientName(this.formPatient.get('nomePaciente')?.value)
          .subscribe((ret) => {
            this.drugs = ret;
          });
      });
    }

    this.pacientes.forEach((patient) => {
      if (patient.nome === this.formPatient.get('nomePaciente')?.value) {
        this.formDrug.get('idPaciente')?.setValue(patient.id);
        this.formDrug.get('nomePaciente')?.setValue(patient.nome);
      }
    });

    if (this.formPatient.get('medicamento')?.value != null) {
      this.drugs.forEach((item) => {
        if (item.descricao === this.formPatient.get('medicamento')?.value) {
          const novaData = item.dtaMedicamento.split(' ');
          this.formDrug.patchValue(item);
          this.formDrug.get('dtaMedicamento')?.setValue(novaData[0]);
          this.formDrug.get('horario')?.setValue(novaData[1]);
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
      .get('dtaMedicamento')
      ?.setValue(new Date().toLocaleDateString('en-GB'));

    this.formDrug
      .get('horario')
      ?.setValue(formatDate(new Date(), 'H:mm:ss', 'en'));
  }

  saveDrug(drug: Drug) {
    this.drugService.saveDrug(drug).subscribe(() => {
      this.notificationService.openSnackBar(
        'Medicamento cadastrado com sucesso!'
      );
      this.clearForm();
      this.router.navigateByUrl('/home');
    });
  }

  updateDrug(drug: Drug) {
    this.drugService.updateDrug(drug).subscribe(() => {
      this.notificationService.openSnackBar(
        'Medicamento atualizado com sucesso!'
      );
      this.router.navigate(['/dashboard']);
    });
  }

  editDrug() {
    const id = this.formDrug.get('id')?.value;
    const novoNome = this.formDrug.get('descricao')?.value;
    const idPaciente = this.formDrug.get('idPaciente')?.value;
    const novaData = `${this.formDrug.get('dtaMedicamento')?.value} ${
      this.formDrug.get('horario')?.value
    }`;
    const novoTipo = this.formDrug.get('tipo')?.value;
    const novaQuantidade = this.formDrug.get('quantidade')?.value;
    const novaUnidade = this.formDrug.get('unidade')?.value;
    const novasObservacoes = this.formDrug.get('observacao')?.value;

    if (this.formDrug.valid) {
      this.drugService.getDrug().subscribe((ret) => {
        ret.forEach((drug) => {
          if (drug.id === id) {
            drug.idPaciente = idPaciente;
            drug.descricao = novoNome;
            drug.dtaMedicamento = novaData;
            drug.tipo = novoTipo;
            drug.quantidade = novaQuantidade;
            drug.unidade = novaUnidade;
            drug.observacao = novasObservacoes;
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

      this.router.navigate(['/dashboard']);
    }
  }

  logs() {
    this.dialog.open(ListLogsComponent, {
      data: {
        tabLink: 'MEDICAMENTO',
        codLink:  this.formDrug.get('id')?.value,
      },
    });
  }

  onSubmit() {
    if (this.formDrug.valid && this.isEditing == false) {
      const novaData = `${this.formDrug.get('dtaMedicamento')?.value} ${
        this.formDrug.get('horario')?.value
      }`;
      this.formDrug.get('dtaMedicamento')?.setValue(novaData);
      return this.saveDrug(this.formDrug.value);
    }
  }
}
