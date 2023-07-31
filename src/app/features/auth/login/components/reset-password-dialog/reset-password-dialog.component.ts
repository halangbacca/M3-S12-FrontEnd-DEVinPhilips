import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../../shared/services/user/user.service';
import { PasswordRequest } from '../../../../../shared/models/PasswordRequest';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss'],
})
export class ResetPasswordDialogComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  userId!: number;
  passwordRequest = {} as PasswordRequest;

  constructor(
    private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    private fb: FormBuilder,
    private service: UserService
  ) {}

  ngOnInit() {
    this.resetPasswordForm = this.fb.group(
      {
        email: [
          '',
          Validators.compose([Validators.email, Validators.required]),
        ],
        password: [
          '',
          Validators.compose([Validators.minLength(6), Validators.required]),
        ],
        passwordConfirmation: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  getUserId() {
    const email = this.resetPasswordForm.get('email')?.value;
    this.service
      .getUserId(email)
      .subscribe((result) => this.userId = result.id);
  }

  resetPassword() {
    this.passwordRequest = {
      id: this.userId,
      email: this.resetPasswordForm.get('email')?.value,
      senha: this.resetPasswordForm.get('password')?.value,
    };
    console.log(this.passwordRequest);
    this.service
      .resetPassword(this.passwordRequest, this.userId)
      .subscribe(() => this.dialogRef.close());
  }

  closeDialog() {
    this.dialogRef.close();
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password1 = control.get('password')?.value;
    const password2 = control.get('passwordConfirmation')?.value;

    if (password1 !== password2) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
