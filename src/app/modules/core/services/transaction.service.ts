import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TransactionOverview } from '../../shared/models/transaction-overview';
import { BaseModel } from '../../shared/models/base-model';
import { CreateTransactionCommand } from '../../shared/models/create-transaction-command';
import { TransactionsByCategory } from '../../shared/models/transactions-by-category';
import { Pageable } from '../../shared/models/pageable';
import { FilterValue, SieveBuilder, SortValue } from '../../shared/sieve';
import { TransactionSearch } from '../../shared/models/transaction-search';
import { catchError } from 'rxjs/operators';
import { FilesService } from './files.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly _baseUrl = '/transaction';

  constructor(
    private http: HttpClient,
    private sieve: SieveBuilder,
    private filesService: FilesService
  ) {}

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

  public search(
    sorts: SortValue[] = null,
    filters: FilterValue[] = null,
    pageStart: number = null,
    pageSize: number = 50
  ): Observable<Pageable<TransactionSearch>> {
    const params = this.sieve.getQueryParamsString(
      sorts,
      filters,
      pageStart,
      pageSize
    );
    return this.http
      .get<Pageable<TransactionSearch>>(`${this._baseUrl}/search${params}`)
      .pipe(catchError(() => of(Pageable.Empty<TransactionSearch>())));
  }

  public exportToExcel(
    sorts: SortValue[] = null,
    filters: FilterValue[] = null,
    pageStart: number = null,
    pageSize: number = 50
  ): Observable<void> {
    const params = this.sieve.getQueryParamsString(
      sorts,
      filters,
      pageStart,
      pageSize
    );
    return this.http
      .get(`${this._baseUrl}/export${params}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(map((res) => this.filesService.downloadWithName(res)));
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
