import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Diet } from '../../models/Dieta';

  @Injectable({
    providedIn: 'root',
  })
  export class DietService {
    url = `${environment.URL_API}${environment.API_DIET}`;

    constructor(private httpClient: HttpClient, private router: Router) {}

    httpOptions = {
      headers: new HttpHeaders(environment.HEADER),
    };

    getDiet(): Observable<Diet[]> {
      return this.httpClient
        .get<Diet[]>(this.url, this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
    }

    getDietByPatientName(nome: string): Observable<Diet[]> {
      return this.httpClient
        .get<Diet[]>(`${this.url}?nomePaciente=${nome}`)
        .pipe(retry(2), catchError(this.handleError));
    }

    getDietByPatientId(id: number): Observable<Diet[]> {
      return this.httpClient
        .get<Diet[]>(`${this.url}?idPaciente=${id}`)
        .pipe(retry(2), catchError(this.handleError));
    }

    saveDiet(diet: Diet): Observable<Diet[]> {
      return this.httpClient
        .post<Diet[]>(this.url, JSON.stringify(diet), this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
    }

    updateDiet(diet: Diet): Observable<Diet[]> {
      return this.httpClient
        .put<Diet[]>(
          `${this.url}/${diet.id}`,
          JSON.stringify(diet),
          this.httpOptions
        )
        .pipe(retry(2), catchError(this.handleError));
    }

    deleteDiet(id: Number): Observable<Diet> {
      return this.httpClient.delete<Diet>(`${this.url}/${id}`);
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