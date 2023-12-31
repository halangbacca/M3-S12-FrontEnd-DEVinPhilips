import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AppointmentRequest } from '../../models/AppointmentRequest';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { AppointmentResponse } from '../../models/AppointmentResponse';
import { Exercise } from '../../models/Exercicio';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  url = `${environment.URL_API}${environment.API_APPOINTMENT}`;

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  saveAppointment(
    appointment: AppointmentRequest
  ): Observable<AppointmentRequest> {
    return this.httpClient
      .post<AppointmentRequest>(
        `${this.url}`,
        JSON.stringify(appointment),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  getAllAppointments(): Observable<AppointmentRequest[]> {
    return this.httpClient
      .get<AppointmentRequest[]>(this.url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAppointmentById(id: Number): Observable<AppointmentResponse> {
    return this.httpClient
      .get<AppointmentResponse>(`${this.url}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAppointmentByPatientName(nome: string): Observable<AppointmentResponse[]> {
    const nomeEncoded = encodeURIComponent(nome);
    return this.httpClient
      .get<AppointmentResponse[]>(`${this.url}?nomePaciente=${nomeEncoded}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAppointmentByPatientId(id: Number): Observable<AppointmentRequest[]> {
    return this.httpClient
      .get<AppointmentRequest[]>(`${this.url}/paciente/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }
  updateAppointment(
    appointment: AppointmentRequest
  ): Observable<AppointmentRequest> {
    return this.httpClient
      .put<AppointmentRequest>(
        `${this.url}/${appointment.id}`,
        JSON.stringify(appointment),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteAppointment(id: Number): Observable<AppointmentRequest[]> {
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
