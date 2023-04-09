import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const user = this.authService.currentUser;
    if (user && user.bearerToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `${user.bearerToken}`,
        },
      });
    }

    return next.handle(request);
  }
}
