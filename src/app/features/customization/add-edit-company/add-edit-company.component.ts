import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/shared/models/Company';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CompanyService } from '../../../shared/services/company/customization.service';
import { ListLogsComponent } from '../../logs/list-logs/list-logs.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss'],
})
export class AddEditCompanyComponent {
  company = {} as Company;
  companies = [] as Company[];

  formCompany!: FormGroup;
  formExistingCompany!: FormGroup;

  isDisabled = true;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private companyService: CompanyService,
    public dialog: MatDialog
  ) {}

  createform(company: Company) {
    this.formCompany = this.formBuilder.group({
      id: [company.id],
      nome: [company.nome, [Validators.required]],
      slogan: [company.slogan],
      palhetaDeCores: [company.palhetaDeCores, [Validators.required]],
      logotipo: [company.logotipo, [Validators.required]],
      situacao: [true],
    });
  }

  ngOnInit(): void {
    this.createform(this.company);
    this.createExistingCompanyForm();

    this.companyService.getCompany().subscribe((ret) => {
      this.companies = ret;
    });
  }

  createExistingCompanyForm() {
    this.formExistingCompany = this.formBuilder.group({
      nomeEmpresa: ['', [Validators.required]],
    });
  }

  onFocus() {
    this.companyService.getCompany().subscribe((ret) => {
      this.companies = ret;
    });

    this.companies.forEach((company) => {
      if (company.nome === this.formExistingCompany.get('nomeEmpresa')?.value) {
        this.formCompany.get('id')?.setValue(company.id);
      }
    });

    if (this.formExistingCompany.get('nomeEmpresa')?.value != null) {
      this.companies.forEach((item) => {
        if (item.nome === this.formExistingCompany.get('nomeEmpresa')?.value) {
          this.formCompany.patchValue(item);
          this.isDisabled = false;
          this.isEditing = true;
        }
      });
    }
  }

  clearForm() {
    this.formCompany.reset();
    this.formExistingCompany.reset();

    this.company = {} as Company;

    this.companyService.getCompany().subscribe((ret) => {
      this.companies = ret;
    });

    this.isDisabled = true;
    this.isEditing = false;
  }

  saveCompany(company: Company) {
    this.companyService.saveCompany(company).subscribe(() => {
      this.notificationService.openSnackBar('Empresa cadastrada com sucesso!');
      this.clearForm();
    });
  }

  updateCompany(company: Company) {
    this.companyService.updateCompany(company).subscribe(() => {
      this.notificationService.openSnackBar('Empresa atualizada com sucesso!');
      this.clearForm();
    });
  }

  editCompany() {
    const id = this.formCompany.get('id')?.value;
    const novoNome = this.formCompany.get('nome')?.value;
    const novoSlogan = this.formCompany.get('slogan')?.value;
    const novaCor = this.formCompany.get('palhetaDeCores')?.value;
    const novaLogo = this.formCompany.get('logotipo')?.value;

    if (this.formCompany.valid) {
      this.companyService.getCompany().subscribe((ret) => {
        ret.forEach((company) => {
          if (company.id === id) {
            company.nome = novoNome;
            company.slogan = novoSlogan;
            company.palhetaDeCores = novaCor;
            company.logotipo = novaLogo;
            company.situacao = true;
            this.updateCompany(company);
          }
        });
      });
    }
  }

  deleteCompany() {
    if (this.formCompany.valid) {
      this.companyService
        .deleteCompany(this.formCompany.get('id')?.value)
        .subscribe(() => {
          this.notificationService.openSnackBar(
            'Empresa deletada com sucesso!'
          );
        });

      this.clearForm();
    }
  }

  logs() {
    this.dialog.open(ListLogsComponent, {
      data: {
        tabLink: 'USUARIO',
        codLink: 1,
      },
    });
  }

  onSubmit() {
    if (this.formCompany.valid && this.isEditing == false) {
      return this.saveCompany(this.formCompany.value);
    }
  }
}
