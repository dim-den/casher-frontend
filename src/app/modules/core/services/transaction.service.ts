import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WalletOverview } from '../../shared/models';
import { TransactionOverview } from '../../shared/models/transaction-overview';
import { CreateWalletCommand } from '../../shared/models/create-wallet-command';
import { BaseModel } from '../../shared/models/base-model';
import { CreateTransactionCommand } from '../../shared/models/create-transaction-command';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly _baseUrl = '/transaction';

  constructor(private http: HttpClient) {}

  public getTransactions(
    walletId: number,
    start: Date,
    end: Date
  ): Observable<TransactionOverview[]> {
    return this.http.get<TransactionOverview[]>(
      `${
        this._baseUrl
      }?walletId=${walletId}&start=${start.toDateString()}&end=${end.toDateString()}`
    );
  }

  public create(command: CreateTransactionCommand): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${this._baseUrl}`, command);
  }
}
