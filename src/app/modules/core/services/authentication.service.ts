import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserAccessData } from '../../shared/models';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { DateTime } from '../constants';
import { AppRoutes } from '../../../app-routing.module';
import { catchError, tap } from 'rxjs/operators';
import { Credential } from '../../shared/models/credential';
import { Registration } from '../../shared/models/registration';
import { error } from '@angular/compiler-cli/src/transformers/util';
import { ErrorResponse } from '../../shared/models/error-response';

const CURRENT_USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly _baseUrl = '/authentication';
  private currentUserSubject: BehaviorSubject<UserAccessData>;
  currentUser$: Observable<UserAccessData>;
  private _loggedOutManually = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    const user = this.localStorageService.get<UserAccessData>(CURRENT_USER_KEY);
    this.currentUserSubject = new BehaviorSubject<UserAccessData>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  signIn(
    credential: Credential,
    withCredentials = true
  ): Observable<UserAccessData | ErrorResponse> {
    return this.http
      .post<UserAccessData>(`${this._baseUrl}/login`, credential, {
        withCredentials,
      })
      .pipe(
        catchError((e) => of(e.error)),
        tap((userWithToken) => this.setupCurrentUser(userWithToken))
      );
  }

  register(
    credential: Registration,
    withCredentials = true
  ): Observable<UserAccessData | ErrorResponse> {
    return this.http
      .post<UserAccessData>(`${this._baseUrl}/register`, credential, {
        withCredentials,
      })
      .pipe(
        catchError((e) => of(e.error)),
        tap((userWithToken) => this.setupCurrentUser(userWithToken))
      );
  }

  public changePassword(value: {
    password?: string;
    newPassword?: string;
  }): Observable<UserAccessData | ErrorResponse> {
    return this.http
      .post<void>(`${this._baseUrl}/change`, value)
      .pipe(catchError((e) => of(e.error)));
  }

  public sendConfirmEmail(): Observable<void> {
    return this.http.post<void>(`${this._baseUrl}/send/confirm`, {});
  }

  public sendResetPasswordEmail(value: { email: string }): Observable<void> {
    return this.http.post<void>(`${this._baseUrl}/send/reset`, value);
  }

  public confirmEmail(code: string): Observable<void> {
    return this.http.post<void>(`${this._baseUrl}/confirm`, { code });
  }

  public resetPassword(value: {
    password?: string;
    confirmPassword?: string;
    code?: string;
  }): Observable<UserAccessData | ErrorResponse> {
    return this.http
      .post<void>(`${this._baseUrl}/reset`, value)
      .pipe(catchError((e) => of(e.error)));
  }

  private setupCurrentUser(userWithToken: UserAccessData): void {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    this.localStorageService.set(CURRENT_USER_KEY, userWithToken);
    this.currentUserSubject.next(userWithToken);
  }

  public get currentUser(): UserAccessData {
    return this.currentUserSubject.value;
  }

  get loggedOutManually(): boolean {
    return this._loggedOutManually;
  }

  get isAuthorized(): boolean {
    const exp = this.currentUserSubject?.value?.exp;
    const current = DateTime.Now.toDate();
    return new Date(exp) > current;
  }

  public logoutAndRedirectToLogin(): void {
    let returnUrl =
      this.router.getCurrentNavigation()?.extractedUrl.toString() ??
      this.router.parseUrl(this.router.url).queryParams.returnUrl;

    if (returnUrl?.length <= 1) {
      //  there could be '/'
      returnUrl = null;
    }
    this.logout(returnUrl);
  }

  public logout(returnUrl = null, manual = false): void {
    if (manual) {
      this._loggedOutManually = true;
    }
    this.localStorageService.remove(CURRENT_USER_KEY);
    this.currentUserSubject.next(null);

    void this.router.navigate(['auth', 'login'], {
      queryParams: { returnUrl },
    });
  }
}
