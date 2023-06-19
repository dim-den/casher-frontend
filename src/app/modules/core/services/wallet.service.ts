import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WalletOverview } from '../../shared/models';
import { catchError, tap } from 'rxjs/operators';
import { BaseModel } from '../../shared/models/base-model';
import { CreateWalletCommand } from '../../shared/models/create-wallet-command';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly _baseUrl = '/wallet';

  public selectedWallet$ = new BehaviorSubject<WalletOverview>(null);
  private loadedWallets: WalletOverview[] = [];
  public availableToSelectWallets$ = new BehaviorSubject<WalletOverview[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.authService.currentUser$.subscribe((x) => {
      this.selectedWallet$.next(null);
      this.loadedWallets = [];
      this.availableToSelectWallets$.next([]);

      if(x.id && !this.selectedWallet$.value){
        this.getAllUserWallets().subscribe();
      }
    });
  }

  public getAllUserWallets(): Observable<WalletOverview[]> {
    return this.http.get<WalletOverview[]>(`${this._baseUrl}`).pipe(
      tap((x) => {
        this.loadedWallets = [...x];
        this.updateActiveWallets();
      }),
      catchError(() => of([]))
    );
  }

  private updateActiveWallets() {
    let activeId = this.selectedWallet$.value
      ? this.selectedWallet$.value.id
      : this.loadedWallets.find((x) => x.isDefault)?.id;
    if (!activeId || !this.loadedWallets.find((x) => x.id == activeId)) {
      activeId =
        this.loadedWallets?.length > 0 ? this.loadedWallets[0].id : null;
    }
    this.setCurrentActiveWallet(activeId);
  }
  public setCurrentActiveWallet(id: number) {
    this.selectedWallet$.next(this.loadedWallets.find((x) => x.id === id));
    this.availableToSelectWallets$.next(
      this.loadedWallets.filter((x) => x.id !== id)
    );
  }

  public create(command: CreateWalletCommand): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${this._baseUrl}`, command);
  }

  public update(
    id: number,
    command: CreateWalletCommand
  ): Observable<BaseModel> {
    return this.http.put<BaseModel>(`${this._baseUrl}/${id}`, command);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
