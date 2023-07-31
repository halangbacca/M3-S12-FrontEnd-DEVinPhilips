import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../models/User';
import { UserIdResponse } from "../../models/UserIdResponse";
import { PasswordRequest } from "../../models/PasswordRequest";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = `${environment.URL_API}${environment.API_USER}`;

  constructor(private httpClient: HttpClient, private router: Router) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  getUser(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getUserById(id: number): Observable<User[]> {
    return this.httpClient
      .get<User[]>(`${this.url}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  saveUser(user: User): Observable<User[]> {
    return this.httpClient
      .post<User[]>(this.url, JSON.stringify(user), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateUser(user: User): Observable<User[]> {
    return this.httpClient
      .put<User[]>(
        `${this.url}/${user.id}`,
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteUser(id: Number): Observable<User> {
    return this.httpClient.delete<User>(`${this.url}/${id}`);
  }

  getUserId(email: String): Observable<UserIdResponse> {
    return this.httpClient.get<UserIdResponse>(`${this.url}/obter_id/${email}`)
        .pipe(retry(2), catchError(this.handleError));
  }

  resetPassword(passwordRequest: PasswordRequest, id: Number): Observable<any> {
    return this.httpClient.put<Observable<any>>(`${this.url}/resetarsenha/${id}`, JSON.stringify(passwordRequest), this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage =
        `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    //console.log(errorMessage);
    return throwError(() => errorMessage);
  }
}
