import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { WalletOverview } from '../../shared/models';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { catchError, tap } from 'rxjs/operators';
import { CreateWalletCommand } from '../../shared/models/create-wallet-command';
import { BaseModel } from '../../shared/models/base-model';
import { WalletLimitationOverview } from '../../shared/models/wallet-limitation-overview';
import { CreateLimitationCommand } from '../../shared/models/create-limitition-command';

@Injectable({
  providedIn: 'root',
})
export class WalletLimitationService {
  private readonly _baseUrl = '/walletLimitation';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  public getUserLimitation(): Observable<WalletLimitationOverview[]> {
    return this.http
      .get<WalletLimitationOverview[]>(`${this._baseUrl}`)
      .pipe(catchError(() => of([])));
  }

  public create(command: CreateLimitationCommand): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${this._baseUrl}`, command);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
