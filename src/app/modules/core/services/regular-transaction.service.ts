import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionOverview } from '../../shared/models/transaction-overview';
import { CreateTransactionCommand } from '../../shared/models/create-transaction-command';
import { BaseModel } from '../../shared/models/base-model';
import { CreateRegularTransactionCommand } from '../../shared/models/create-regular-transaction-command';

@Injectable({
  providedIn: 'root',
})
export class RegularTransactionService {
  private readonly _baseUrl = '/regularTransaction';

  constructor(private http: HttpClient) {}

  public create(
    command: CreateRegularTransactionCommand
  ): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${this._baseUrl}`, command);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
