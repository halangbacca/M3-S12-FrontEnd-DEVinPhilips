import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from 'src/app/shared/models/Company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  url = `${environment.URL_API}${environment.API_COMPANY}`;

  constructor(private httpClient: HttpClient, private router: Router) {}

  httpOptions = {
    headers: new HttpHeaders(environment.HEADER),
  };

  getCompany(): Observable<Company[]> {
    return this.httpClient
      .get<Company[]>(this.url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  saveCompany(company: Company): Observable<Company[]> {
    return this.httpClient
      .post<Company[]>(this.url, JSON.stringify(company), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteCompany(id: Number): Observable<Company> {
    return this.httpClient.delete<Company>(`${this.url}/${id}`);
  }

  updateCompany(company: Company): Observable<Company[]> {
    return this.httpClient
      .put<Company[]>(
        `${this.url}/${company.id}`,
        JSON.stringify(company),
        this.httpOptions
      )
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
