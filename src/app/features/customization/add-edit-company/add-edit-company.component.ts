import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/shared/models/Company';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CustomizationService } from '../customization.service';

@Component({
  selector: 'app-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss'],
})
export class AddEditCompanyComponent {
  company = {} as Company;

  formCompany!: FormGroup;

  companies = [] as Company[];

  isDisabled = true;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private customizationService: CustomizationService
  ) {}

  createform(company: Company) {
    this.formCompany = this.formBuilder.group({
      id: [company.id],
      empresa: [company.nome],
      nome: [company.nome, [Validators.required]],
      slogan: [company.slogan],
      palhetaDeCores: [company.palhetaDeCores, [Validators.required]],
      imagemDoLogotipo: [company.imagemDoLogotipo, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.createform(this.company);

    this.customizationService.getCompany().subscribe((ret) => {
      this.companies = ret;
    });
  }

  onFocus() {
    this.customizationService.getCompany().subscribe((ret) => {
      this.companies = ret;
    });

    if (this.formCompany.get('empresa')?.value != null) {
      this.companies.forEach((item) => {
        if (item.nome === this.formCompany.get('empresa')?.value) {
          this.formCompany.patchValue(item);
        }
        this.isDisabled = false;
      });
    }
  }

  clearForm() {
    this.formCompany.reset();
    this.company = {} as Company;
  }

  saveCompany(company: Company) {
    this.companies.forEach((item) => {
      if (item.id === company.id) {
        this.notificationService.openSnackBar('Empresa já cadastrada!');
      }
    });
    this.customizationService.saveCompany(company).subscribe(() => {
      this.notificationService.openSnackBar('Empresa cadastrada com sucesso!');
      this.clearForm();
    });
  }

  updateCompany(company: Company) {
    this.customizationService.updateCompany(company).subscribe(() => {
      this.notificationService.openSnackBar('Empresa atualizada com sucesso!');
      this.clearForm();
    });
  }

  editCompany() {
    const id = this.formCompany.get('id')?.value;
    const novoNome = this.formCompany.get('nome')?.value;
    const novoSlogan = this.formCompany.get('slogan')?.value;
    const novaCor = this.formCompany.get('palhetaDeCores')?.value;
    const novaLogo = this.formCompany.get('imagemDoLogotipo')?.value;

    if (this.formCompany.valid) {
      this.customizationService.getCompany().subscribe((ret) => {
        ret.forEach((company) => {
          if (company.id === id) {
            company.nome = novoNome;
            company.slogan = novoSlogan;
            company.palhetaDeCores = novaCor;
            company.imagemDoLogotipo = novaLogo;
            this.updateCompany(company);
          }
        });
      });
    }
  }

  onSubmit() {
    if (this.formCompany.valid) {
      return this.saveCompany(this.formCompany.value);
    }
  }
}
