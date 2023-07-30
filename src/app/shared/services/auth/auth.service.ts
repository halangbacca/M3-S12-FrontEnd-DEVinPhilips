import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { Credential } from '../../models/Credential';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = `${environment.URL_API}${environment.API_USER}/login`;

  constructor(private httpClient: HttpClient, private router: Router) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER)
  };

  login(login : Credential ) {
    this.httpClient
    .post<User>(this.url, JSON.stringify(login) ,this.httpOptions)
      .subscribe((res) => {
        localStorage.setItem('medsoftToken', JSON.stringify(res));
        this.router.navigate(['/']);
      });
  }

  isLoggedIn() : boolean {
    const localStorageToken = localStorage.getItem('medsoftToken');
    if (!localStorageToken) {
      return false;
    }
    return true
  }

  getToken(): Credential | null {
    return this.isLoggedIn() ? JSON.parse(localStorage.getItem('medsoftToken') || '{}') : null;
  }

  logout(): void {
    localStorage.removeItem('medsoftToken');
    this.router.navigate(['/login']);
  }

}
