import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/shared/models/User';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ListLogsComponent } from '../../logs/list-logs/list-logs.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent {
  user = {} as User;
  users = [] as User[];

  usuarioId = '';

  formUser!: FormGroup;
  formExistingUser!: FormGroup;

  isDisabled = true;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private auth: AuthService
  ) {}

  createform(user: User) {
    this.formUser = this.formBuilder.group({
      id: [user.id],
      nome: [
        user.nome,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
        ],
      ],
      genero: [user.genero, [Validators.required]],
      cpf: [user.cpf, [Validators.required]],
      telefone: [user.telefone, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      senha: [user.senha, [Validators.required, Validators.minLength(6)]],
      nivel: [user.nivel, [Validators.required]],
      situacao: [true],
    });
  }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id')!;

    if (this.usuarioId != 'add') {
      this.createform(this.user);
      this.createExistingUserForm();

      this.userService
        .getUserById(parseInt(this.usuarioId))
        .subscribe((ret) => {
          this.formUser.patchValue(ret);
        });
      this.isDisabled = false;
      this.isEditing = true;
    } else {
      this.createform(this.user);
      this.createExistingUserForm();

      this.userService.getUser().subscribe((ret) => {
        this.users = ret;
      });
    }
  }

  createExistingUserForm() {
    this.formExistingUser = this.formBuilder.group({
      nomeUsuario: ['', [Validators.required]],
    });
  }

  onFocus() {
    this.userService.getUser().subscribe((ret) => {
      this.users = ret;
    });

    this.users.forEach((user) => {
      if (user.nome === this.formExistingUser.get('nomeUsuario')?.value) {
        this.formUser.get('id')?.setValue(user.id);
      }
    });

    if (this.formExistingUser.get('nomeUsuario')?.value != null) {
      this.users.forEach((item) => {
        if (item.nome === this.formExistingUser.get('nomeUsuario')?.value) {
          this.formUser.patchValue(item);
          this.isDisabled = false;
          this.isEditing = true;
        }
      });
    }
  }

  clearForm() {
    this.formUser.reset();
    this.formExistingUser.reset();

    this.users = {} as User[];

    this.userService.getUser().subscribe((ret) => {
      this.users = ret;
    });

    this.isDisabled = true;
    this.isEditing = false;
  }

  saveUser(user: User) {
    this.userService.saveUser(user).subscribe(() => {
      this.notificationService.openSnackBar('Usuário cadastrado com sucesso!');
      this.clearForm();
    });
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe(() => {
      if (user.situacao === true) {
        this.notificationService.openSnackBar(
          'Usuário atualizado com sucesso!'
        );
        this.router.navigate(['/dashboard']);
      } else {
        this.notificationService.openSnackBar('Usuário inativado com sucesso!');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  editUser() {
    const id = this.formUser.get('id')?.value;
    const novoNome = this.formUser.get('nome')?.value;
    const novoGenero = this.formUser.get('genero')?.value;
    const novoCpf = this.formUser.get('cpf')?.value;
    const novoTelefone = this.formUser.get('telefone')?.value;
    const novoEmail = this.formUser.get('email')?.value;
    const novaSenha = this.formUser.get('senha')?.value;
    const novoTipo = this.formUser.get('nivel')?.value;

    if (this.formUser.valid) {
      this.userService.getUser().subscribe((ret) => {
        ret.forEach((user) => {
          if (user.id === id) {
            user.nome = novoNome;
            user.genero = novoGenero;
            user.cpf = novoCpf;
            user.telefone = novoTelefone;
            user.email = novoEmail;
            user.senha = novaSenha;
            user.nivel = novoTipo;
            user.situacao = true;
            this.updateUser(user);
          }
        });
      });
    }
  }

  disableUser() {
    const id = this.formUser.get('id')?.value;

    if (this.formUser.valid) {
      this.userService.getUser().subscribe((ret) => {
        ret.forEach((user) => {
          if (user.id === id && user.situacao == true) {
            user.situacao = false;
            this.updateUser(user);
          } else {
            this.notificationService.openSnackBar(
              'Usuário já se encontra inativado!'
            );
          }
        });
      });
    }
  }

  logs() {
    this.dialog.open(ListLogsComponent, {
      data: {
        tabLink: 'USUARIO',
        codLink: this.formUser.get('id')?.value
      },
    });
  }

  onSubmit() {
    if (this.formUser.valid && this.isEditing == false) {
      return this.saveUser(this.formUser.value);
    }
  }

  isAdmin(){
    return !this.auth.isAdmin();
  }
}
