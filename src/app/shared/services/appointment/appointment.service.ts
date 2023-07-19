import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { AppointmentRequest } from "../../models/AppointmentRequest";
import { catchError, Observable, retry, throwError } from "rxjs";
import { AppointmentResponse } from "../../models/AppointmentResponse";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  url = `${environment.URL_API}${environment.API_APPOINTMENT}`;

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  saveAppointment(appointment: AppointmentRequest): Observable<AppointmentRequest> {
    return this.httpClient
      .post<AppointmentRequest>(`${this.url}/cadastrar`, JSON.stringify(appointment), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAllConsult(): Observable<AppointmentRequest[]> {
    return this.httpClient
      .get<AppointmentRequest[]>(this.url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAppointmentById(id: Number): Observable<AppointmentResponse> {
    return this.httpClient
      .get<AppointmentResponse>(`${this.url}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExamByPatientId(id: Number): Observable<AppointmentRequest[]> {
    return this.httpClient
      .get<AppointmentRequest[]>(
        `${this.url}/?idPatient=${id}&_sort=dtaConsulta&_order=desc`
      )
      .pipe(retry(2), catchError(this.handleError));
  }
  updateAppointment(appointment: AppointmentRequest): Observable<AppointmentRequest> {
    return this.httpClient
      .put<AppointmentRequest>(
        `${this.url}/atualizar/${appointment.id}`,
        JSON.stringify(appointment),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteConsult(id: Number): Observable<AppointmentRequest[]> {
    return this.httpClient.delete<AppointmentRequest[]>(`${this.url}/${id}`);
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
