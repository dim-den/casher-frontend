import { Injectable } from '@angular/core';
import { UrlTree, CanActivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthenticationService) {}

  canLoad():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.checkIsAuthorized();
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkIsAuthorized();
  }

  private checkIsAuthorized(): Promise<boolean> | boolean {
    if (!this.authService.isAuthorized) {
      this.authService.logoutAndRedirectToLogin();
      return false;
    }
    return true;
  }
}
