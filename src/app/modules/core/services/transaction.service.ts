import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WalletOverview } from '../../shared/models';
import { TransactionOverview } from '../../shared/models/transaction-overview';
import { CreateWalletCommand } from '../../shared/models/create-wallet-command';
import { BaseModel } from '../../shared/models/base-model';
import { CreateTransactionCommand } from '../../shared/models/create-transaction-command';
import { TransactionsByCategory } from '../../shared/models/transactions-by-category';

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

  public getCategoryStat(
    walletId: number,
    start: Date,
    end: Date
  ): Observable<TransactionsByCategory> {
    return this.http.get<TransactionsByCategory>(
      `${
        this._baseUrl
      }/category?walletId=${walletId}&start=${start.toDateString()}&end=${end.toDateString()}`
    );
  }

  public create(command: CreateTransactionCommand): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${this._baseUrl}`, command);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${id}`);
  }

  public update(
    id: number,
    command: CreateTransactionCommand
  ): Observable<BaseModel> {
    return this.http.put<BaseModel>(`${this._baseUrl}/${id}`, command);
  }
}
