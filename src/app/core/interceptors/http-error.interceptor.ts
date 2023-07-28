import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, EMPTY, Observable } from 'rxjs';
import { HttpErrorHandlerService } from 'src/app/shared/services/http-error/http-error-handler.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private httpErrorHandlerService: HttpErrorHandlerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        this.httpErrorHandlerService.handleError(error);

        return EMPTY;
      })
    );
  }
}