import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Drug } from '../../models/Drug';

@Injectable({
  providedIn: 'root',
})
export class DrugService {
  url = `${environment.URL_API}${environment.API_DRUG}`;

  constructor(private httpClient: HttpClient, private router: Router) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  getDrug(): Observable<Drug[]> {
    return this.httpClient
      .get<Drug[]>(this.url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getDrugByPatientName(nome: string): Observable<Drug[]> {
    return this.httpClient
      .get<Drug[]>(`${this.url}/?nomePaciente=${nome}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getDrugByPatientId(id: number): Observable<Drug[]> {
    return this.httpClient
      .get<Drug[]>(`${this.url}/?idPaciente=${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  saveDrug(drug: Drug): Observable<Drug[]> {
    return this.httpClient
      .post<Drug[]>(this.url, JSON.stringify(drug), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateDrug(drug: Drug): Observable<Drug[]> {
    return this.httpClient
      .put<Drug[]>(
        `${this.url}/${drug.id}`,
        JSON.stringify(drug),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteDrug(id: Number): Observable<Drug> {
    return this.httpClient.delete<Drug>(`${this.url}/${id}`);
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
