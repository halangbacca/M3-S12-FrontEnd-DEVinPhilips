import { Injectable } from '@angular/core';
import { environment } from '@environments';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";
import { ExamResponse } from "../../models/ExamResponse";
import { ExamRequest } from "../../models/ExamRequest";

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  url = `${environment.URL_API}${environment.API_EXAM}`;

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  saveExam(exam: ExamRequest): Observable<ExamRequest> {
    return this.httpClient
      .post<ExamRequest>(`${this.url}`, JSON.stringify(exam), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAllExam(): Observable<ExamResponse[]> {
    return this.httpClient
      .get<ExamResponse[]>(this.url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExamById(id: Number): Observable<ExamResponse> {
    return this.httpClient
      .get<ExamResponse>(`${this.url}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExamByPatientId(id: Number): Observable<ExamResponse[]> {
    return this.httpClient
      .get<ExamResponse[]>(`${this.url}/paciente/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }


  getExamByPatientNome(nome: string): Observable<ExamResponse[]> {
    return this.httpClient
      .get<ExamResponse[]>(`${this.url}?nomePaciente=${nome}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateExam(exam: ExamRequest): Observable<ExamResponse> {
    return this.httpClient
      .put<ExamResponse>(
        `${this.url}/${exam.id}`,
        JSON.stringify(exam),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteExam(id: Number): Observable<ExamResponse[]> {
    return this.httpClient.delete<ExamResponse[]>(`${this.url}/${id}`);
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
