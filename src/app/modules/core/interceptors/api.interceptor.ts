import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {}

  private adjustUrl(url: string) {
    const ignore = ['http://', 'https://', 'assets'];

    for (let x = 0; x <= ignore.length; x++) {
      if (url.toLowerCase().startsWith(ignore[x])) {
        return url;
      }
    }
    return environment.endpoint + url;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const dupReq = req.clone({
      url: this.adjustUrl(req.url),
      setHeaders: {
        ['ngsw-bypass']: 'true',
      },
    });

    return next.handle(dupReq);
  }
}
