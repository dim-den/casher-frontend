import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // tap(() => {
      //   this.notificationService.reconnectAfterDisconnectedIfNecessary();
      // }),
      catchError((x: HttpErrorResponse) => this.handleError(x))
    );
  }

  private handleError(err: HttpErrorResponse): Observable<HttpEvent<any>> {
    const msg = err.error?.Error as string;
    switch (err.status) {
      case 401:
        this.notificationService.showError(
          msg ?? 'You need to authorize first'
        );
        this.authService.logoutAndRedirectToLogin();
        break;
      case 0:
        this.notificationService.showError(msg ?? 'Service is not available');
        break;
      default:
        if (this.isBlobError(err)) {
          void this.handleBlobError(err).then();
        } else {
          this.notificationService.showError(msg ?? 'Error occured');
        }
    }

    return throwError(() => err);
  }

  private isBlobError(err: any): boolean {
    return (
      err instanceof HttpErrorResponse &&
      err.error instanceof Blob &&
      err.error.type === 'application/json'
    );
  }

  private async handleBlobError(err: HttpErrorResponse) {
    const error = (await err.error.text()) as string;
    const msg = JSON.parse(error)?.Error as string;

    this.notificationService.showError(msg ?? 'Error occurred');
  }
}
