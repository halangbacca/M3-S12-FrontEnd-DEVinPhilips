import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  public handleError = (error: HttpErrorResponse) => {

    if(error.name?.includes('HttpErrorResponse')){
      this._snackBar.open(error.error?.message,'X')}
    }

}

