import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Exercise } from '../../models/Exercicio';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  url = `${environment.URL_API}${environment.API_EXERCISE}`;

  constructor(private httpClient: HttpClient, private router: Router) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  getExercise(): Observable<Exercise[]> {
    return this.httpClient
      .get<Exercise[]>(this.url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExerciseByPatientName(nome: string): Observable<Exercise[]> {
    return this.httpClient
      .get<Exercise[]>(`${this.url}/?nomePaciente=${nome}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExerciseByPatientId(id: number): Observable<Exercise[]> {
    return this.httpClient
      .get<Exercise[]>(`${this.url}/?idPaciente=${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  saveExercise(exercise: Exercise): Observable<Exercise[]> {
    return this.httpClient
      .post<Exercise[]>(this.url, JSON.stringify(exercise), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateExercise(exercise: Exercise): Observable<Exercise[]> {
    return this.httpClient
      .put<Exercise[]>(
        `${this.url}/${exercise.id}`,
        JSON.stringify(exercise),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteExercise(id: Number): Observable<Exercise> {
    return this.httpClient.delete<Exercise>(`${this.url}/${id}`);
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
