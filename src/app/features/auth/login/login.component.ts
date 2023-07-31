import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credential } from '../../../shared/models/Credential';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { WarnDialogComponent } from "./components/warn-dialog/warn-dialog.component";
import { ResetPasswordDialogComponent } from "./components/reset-password-dialog/reset-password-dialog.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  form!: FormGroup;
  credential: Credential = {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public warnDialog: MatDialog,
    public resetPasswordDialog: MatDialog
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  login() {
    if (this.form.valid) {
      this.credential = {...this.form.value};
      this.authService.login(this.credential);
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAllAsTouched();
      });
    }
  }

  openWarnDialog() {
    const warnDialog = this.warnDialog.open(WarnDialogComponent);
  }

  openResetPasswordDialog() {
    const resetPasswordDialog = this.resetPasswordDialog.open(ResetPasswordDialogComponent);
  }

  onClick(event: Event) {
    event.preventDefault();
  }
}
