import { Injectable } from '@angular/core';
import { environment } from "@envoriments";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Patient } from "@shared/models/Patient";
import { catchError, Observable, retry, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  url = `${environment.URL_API}${environment.API_PATIENT}`;

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  savePatient(patient: Patient): Observable<any> {
    return this.httpClient
      .post<Patient>(`${this.url}/cadastrar`, JSON.stringify(patient), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAllPatient(): Observable<Patient[]> {
    return this.httpClient
      .get<Patient[]>(`${this.url}/listar`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getPatientById(id: number): Observable<Patient> {
    return this.httpClient
      .get<Patient>(`${this.url}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this.httpClient
      .put<Patient>(
        `${this.url}/atualizar/${patient.id}`,
        JSON.stringify(patient),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  deletePatient(id: Number): Observable<Patient> {
    return this.httpClient.delete<Patient>(`${this.url}/deletar/${id}`);
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
