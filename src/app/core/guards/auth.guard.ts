import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  private handleUnauthenticatedUser() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open(
        'Você precisa estar logado pra acessar esta página!','OK',
        { duration: 3000 }
      );
      this.router.navigate(['/login']);
    }
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.handleUnauthenticatedUser();

    if (state.url === '/login') {
      this.router.navigate(['/']);
    }

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.handleUnauthenticatedUser();
    return true;
  }
}