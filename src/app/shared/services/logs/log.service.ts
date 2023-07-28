import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Log } from '../../models/Log';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  url = `${environment.URL_API}${environment.API_LOG}`;

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  getAllLogs(): Observable<Log[]> {
    return this.httpClient
      .get<Log[]>(`${this.url}/listar`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getLogByCodLinkAndTabLink(
    codLink: number,
    tabLink: string
  ): Observable<Log[]> {
    return this.httpClient
      .get<Log[]>(`${this.url}?codLink=${codLink}&tabLink=${tabLink}`)
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
