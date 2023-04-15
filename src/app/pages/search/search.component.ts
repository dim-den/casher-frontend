import {
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TransactionService } from '../../modules/core/services/transaction.service';
import { FilterValue, SortValue } from '../../modules/shared/sieve';
import { Pageable } from '../../modules/shared/models/pageable';
import { TransactionOverview } from '../../modules/shared/models/transaction-overview';
import { ETransactionType } from '../../modules/shared/enums/etransaction-type';
import {
  NgbSortableColumnDirective,
  SortEvent,
} from '../../modules/shared/directives/ngb-sortable-column.directive';
import { TransactionSearch } from '../../modules/shared/models/transaction-search';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  DateRangePickerFg,
  NgDate,
} from '../transactions/transactions.component';
import { debounceTime } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { WalletService } from '../../modules/core/services/wallet.service';
import { WalletOverview } from '../../modules/shared/models';

export interface SearchFg {
  walletId: FormControl<number>;
  minAmount: FormControl<number>;
  maxAmount: FormControl<number>;
  category: FormControl<string>;
  description: FormControl<string>;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
@UntilDestroy()
export class SearchComponent {
  page = 1;
  pageSize = 30;

  @ViewChildren(NgbSortableColumnDirective)
  headers: QueryList<NgbSortableColumnDirective>;

  defaultSort = [SortValue.desc('date')];
  additionalSorts: SortValue[] = [];

  form: FormGroup<SearchFg>;
  dateForm: FormGroup<DateRangePickerFg>;

  startDateFilter: FilterValue = null;
  endDateFilter: FilterValue = null;
  searchFilters: FilterValue[] = [];
  items: Pageable<TransactionSearch> = Pageable.Empty();

  walletsData: WalletOverview[] = [];

  constructor(
    private transactionService: TransactionService,
    private walletService: WalletService,
    private fb: FormBuilder
  ) {
    this.walletService.getAllUserWallets().subscribe((x) => {
      this.walletsData = [null, ...x];
    });
    this.loadTransactions();

    this.form = this.fb.group<SearchFg>({
      category: this.fb.control(null),
      walletId: this.fb.control(null),
      description: this.fb.control(null),
      minAmount: this.fb.control(null),
      maxAmount: this.fb.control(null),
    });

    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(250))
      .subscribe((x) => {
        const filters = [];
        x.description &&
          filters.push(FilterValue.contains('description', x.description));
        x.category &&
          filters.push(FilterValue.contains('category', x.category));
        x.walletId && filters.push(FilterValue.equals('walletId', x.walletId));
        x.minAmount &&
          filters.push(
            FilterValue.greaterThanOrEqual('amountByType', x.minAmount)
          );
        x.maxAmount &&
          filters.push(
            FilterValue.lessThanOrEqual('amountByType', x.maxAmount)
          );

        this.searchFilters = filters;
        this.loadTransactions();
      });

    this.dateForm = this.fb.group<DateRangePickerFg>({
      start: null,
      end: null,
    });

    this.dateForm.controls.start.valueChanges
      .pipe(untilDestroyed(this), debounceTime(50))
      .subscribe((x) => {
        if (!x.year || !x.day || !x.month) {
          this.startDateFilter = null;
          this.dateForm.controls.start.setErrors({});
        } else {
          this.dateForm.controls.start.setErrors(null);
          const date = this.getDateFromNgDate(x);
          this.startDateFilter = FilterValue.greaterThanOrEqual(
            'date',
            date.toDateString()
          );
        }
        this.loadTransactions();
      });

    this.dateForm.controls.end.valueChanges
      .pipe(untilDestroyed(this), debounceTime(50))
      .subscribe((x) => {
        if (!x.year || !x.day || !x.month) {
          this.dateForm.controls.end.setErrors({});
          this.endDateFilter = null;
        } else {
          this.dateForm.controls.end.setErrors(null);
          const date = this.getDateFromNgDate(x);
          this.endDateFilter = FilterValue.lessThanOrEqual(
            'date',
            date.toDateString()
          );
        }
        this.loadTransactions();
      });
  }

  getWalletById(id: number): WalletOverview {
    return this.walletsData.find((x) => x?.id === id);
  }

  getDateFromNgDate(value: NgDate): Date {
    return new Date(value.year, value.month - 1, value.day);
  }

  loadTransactions() {
    this.transactionService
      .search(
        [...this.additionalSorts, ...this.defaultSort],
        [
          this.startDateFilter,
          this.endDateFilter,
          ...this.searchFilters,
        ].filter((x) => !!x),
        this.page,
        this.pageSize
      )
      .subscribe((x) => {
        this.items = x;
      });
  }

  getTransactionValue(transaction: TransactionSearch): number {
    return transaction.category.type === ETransactionType.Income
      ? transaction.amount
      : -transaction.amount;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.additionalSorts = [];
    } else {
      this.additionalSorts = [
        direction === 'asc' ? SortValue.asc(column) : SortValue.desc(column),
      ];
    }
    this.loadTransactions();
  }
}
