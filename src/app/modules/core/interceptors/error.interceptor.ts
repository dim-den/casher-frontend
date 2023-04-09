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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
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
        //this.notificationService.showError(msg ?? 'message.unAuthorized');
        //this.authService.logoutAndRedirectToLogin();
        break;
      case 0:
        // this.notificationService.showError(
        //   msg ?? 'message.serverIsNotAvailable'
        // );
        break;
      default:
        if (err.status === 403 && msg && msg.startsWith('Automatic login')) {
          break;
        }
        if (this.isBlobError(err)) {
          void this.handleBlobError(err).then();
        } else {
          //this.notificationService.showError(msg ?? 'message.errorOccurred');
        }
    }
    if (err.status === 404) {
      this.goToNotFound(msg);
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

    // this.notificationService.showError(msg ?? 'message.errorOccurred');
  }

  private goToNotFound(msg: string): void {
    void this.router.navigateByUrl('404', { state: { errorMessage: msg } });
  }
}
