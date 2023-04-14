import { Component, OnInit } from '@angular/core';
import { NewTransactionPopupComponent } from '../../modules/shared/components/new-transaction-popup/new-transaction-popup.component';
import { WalletService } from '../../modules/core/services/wallet.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../modules/core/services/notification.service';
import { TransactionService } from '../../modules/core/services/transaction.service';
import { TransactionOverview } from '../../modules/shared/models/transaction-overview';
import { debounceTime, filter, of, skip } from 'rxjs';
import { DateTime } from '../../modules/core/constants';
import { ETransactionType } from '../../modules/shared/enums/etransaction-type';
import { Chart } from 'chart.js';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  CategoryStat,
  TransactionsByCategory,
} from '../../modules/shared/models/transactions-by-category';

export interface NgDate {
  day: number;
  month: number;
  year: number;
}

export interface TransactionsChartFg {
  start: FormControl<NgDate>;
  end: FormControl<NgDate>;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  transactions: TransactionOverview[];
  transactionGroupedByDay = [];

  transcationType = ETransactionType;
  selectedDate = new Date();

  transactionChatForm: FormGroup<TransactionsChartFg>;

  categoryData: TransactionsByCategory;

  constructor(
    private walletService: WalletService,
    private transactionService: TransactionService,
    public modalService: NgbModal,
    private fb: FormBuilder
  ) {
    let wait = of<any>(null);
    if (!this.walletService.selectedWallet$.value) {
      wait = this.walletService.getAllUserWallets();
    }

    wait.subscribe(() => {
      this.getTransactionsForSelectedDate();
    });

    walletService.availableToSelectWallets$
      .pipe(debounceTime(50), skip(1))
      .subscribe(() => this.getTransactionsForSelectedDate());

    const s = DateTime.moment(this.selectedDate).startOf('month').toDate();
    const e = DateTime.moment(this.selectedDate).endOf('month').toDate();
    this.transactionChatForm = this.fb.group<TransactionsChartFg>({
      start: this.fb.control({
        day: s.getDate(),
        month: s.getMonth() + 1,
        year: s.getFullYear(),
      }),
      end: this.fb.control({
        day: e.getDate(),
        month: e.getMonth() + 1,
        year: e.getFullYear(),
      }),
    });

    this.transactionChatForm.controls.start.valueChanges
      .pipe(debounceTime(10))
      .subscribe((x) => {
        const end = this.getDateFromNgDate(
          this.transactionChatForm.controls.end.value
        );
        if (!x.year || !x.day || !x.month) {
          this.transactionChatForm.controls.start.setErrors({});
        } else {
          const diff = DateTime.diff(
            this.getDateFromNgDate(x),
            end,
            'month',
            true
          );

          if (diff > 0 || diff < -12) {
            this.transactionChatForm.controls.start.setErrors({});
          } else {
            this.transactionChatForm.controls.start.setErrors(null);
          }
        }
      });

    this.transactionChatForm.controls.end.valueChanges
      .pipe(debounceTime(10))
      .subscribe((x) => {
        const start = this.getDateFromNgDate(
          this.transactionChatForm.controls.start.value
        );
        if (!x.year || !x.day || !x.month) {
          this.transactionChatForm.controls.end.setErrors({});
        } else {
          const diff = DateTime.diff(
            start,
            this.getDateFromNgDate(x),
            'month',
            true
          );

          if (diff > 0 || diff < -12) {
            this.transactionChatForm.controls.end.setErrors({});
          } else {
            this.transactionChatForm.controls.end.setErrors(null);
          }
        }
      });

    this.transactionChatForm.valueChanges
      .pipe(
        debounceTime(200),
        filter(() => this.transactionChatForm.valid)
      )
      .subscribe((value) => {
        this.transactionService
          .getTransactions(
            this.walletService.selectedWallet$.value.id,
            this.getDateFromNgDate(value.start),
            this.getDateFromNgDate(value.end)
          )
          .subscribe((x) => {
            const groupedByDay = x.reduce((accumulator, currentValue) => {
              const date = new Date(currentValue.date);
              const key = `${date.getDate()}/${date.getMonth() + 1}`;
              if (!accumulator[key]) {
                accumulator[key] = [];
              }
              accumulator[key].push(currentValue);
              return accumulator;
            }, {});

            const data = Object.entries(groupedByDay).map(
              ([day, transactions]) => ({ key: day, value: transactions })
            );

            this.drawData(
              data,
              this.getDateFromNgDate(value.start),
              this.getDateFromNgDate(value.end)
            );
          });
      });
  }

  getDateFromNgDate(value: NgDate): Date {
    return new Date(value.year, value.month - 1, value.day);
  }

  getTransactionsForSelectedDate() {
    const s = DateTime.moment(this.selectedDate).startOf('month').toDate();
    const e = DateTime.moment(this.selectedDate).endOf('month').toDate();
    this.transactionService
      .getCategoryStat(this.walletService.selectedWallet$.value.id, s, e)
      .subscribe((x) => {
        this.categoryData = x;
        this.drawCategoryData('expensesCategory', x.expenses);
        this.drawCategoryData('incomesCategory', x.incomes);
      });

    this.transactionService
      .getTransactions(this.walletService.selectedWallet$.value.id, s, e)
      .subscribe((x) => {
        this.transactions = x;

        const groupedByDay = x.reduce((accumulator, currentValue) => {
          const date = new Date(currentValue.date);
          const key = `${date.getDate()}/${date.getMonth() + 1}`;

          if (!accumulator[key]) {
            accumulator[key] = [];
          }

          accumulator[key].push(currentValue);

          return accumulator;
        }, {});

        this.transactionGroupedByDay = Object.entries(groupedByDay).map(
          ([day, transactions]) => ({ key: day, value: transactions })
        );

        this.drawData(this.transactionGroupedByDay, s, e);
      });
  }

  getSum(transaction: TransactionOverview[]): number {
    return transaction
      .map((x) =>
        x.category.type === ETransactionType.Income ? x.amount : -x.amount
      )
      .reduce((a, b) => a + b, 0);
  }

  createTransaction() {
    const modalRef = this.modalService.open(NewTransactionPopupComponent, {
      centered: true,
    });

    modalRef.componentInstance.confirmed.subscribe(() => {
      this.getTransactionsForSelectedDate();
      this.walletService.getAllUserWallets().subscribe();
    });
  }

  editTransaction(transaction: TransactionOverview) {
    const modalRef = this.modalService.open(NewTransactionPopupComponent, {
      centered: true,
    });

    modalRef.componentInstance.data = transaction;

    modalRef.componentInstance.confirmed.subscribe(() => {
      this.getTransactionsForSelectedDate();
      this.walletService.getAllUserWallets().subscribe();
    });
  }

  getTransactionValue(transcation: TransactionOverview): number {
    return transcation.category.type === ETransactionType.Income
      ? transcation.amount
      : -transcation.amount;
  }

  getNextPeriodTransactions(direction: 1 | -1) {
    this.selectedDate = DateTime.moment(this.selectedDate)
      .add(direction, 'month')
      .toDate();

    const s = DateTime.moment(this.selectedDate).startOf('month').toDate();
    const e = DateTime.moment(this.selectedDate).endOf('month').toDate();
    this.transactionChatForm.patchValue(
      {
        start: {
          day: s.getDate(),
          month: s.getMonth() + 1,
          year: s.getFullYear(),
        },
        end: {
          day: e.getDate(),
          month: e.getMonth() + 1,
          year: e.getFullYear(),
        },
      },
      { emitEvent: false }
    );

    this.getTransactionsForSelectedDate();
  }

  chart: Chart;
  drawData(data: any[], start: Date, end: Date) {
    var speedCanvas = document.getElementById('speedChart');
    speedCanvas.innerHTML = '';
    this.chart?.destroy();
    const range = this.getDatesInRange(start, end);

    const expenses = [];
    range.forEach((date) => {
      const dateExpenses = data
        .filter((y) => y.key === `${date.getDate()}/${date.getMonth() + 1}`)
        .flatMap((x) => x.value)
        .filter((x) => x.category?.type === ETransactionType.Expense);

      const value = dateExpenses?.length > 0 ? this.getSum(dateExpenses) : 0;
      expenses.push(value);
    });

    const incomes = [];
    range.forEach((date) => {
      const dateIncome = data
        .filter((y) => y.key === `${date.getDate()}/${date.getMonth() + 1}`)
        .flatMap((x) => x.value)
        .filter((x) => x.category?.type === ETransactionType.Income);
      const value = dateIncome?.length > 0 ? this.getSum(dateIncome) : 0;
      incomes.push(value);
    });

    const totalChange = expenses.map((x, i) => incomes[i] + x);

    const size = range.length > 120 ? 1 : range.length > 60 ? 2 : 4;

    var dataFirst = {
      data: expenses,
      fill: false,
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: size,
      pointHoverRadius: size,
      pointBorderWidth: size,
    };

    var dataSecond = {
      data: incomes,
      fill: false,
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: size,
      pointHoverRadius: size,
      pointBorderWidth: size,
    };

    var dataThird = {
      data: totalChange,
      fill: false,
      borderColor: '#6CFF1F',
      backgroundColor: 'transparent',
      pointBorderColor: '#6CFF1F',
      pointRadius: size,
      pointHoverRadius: size,
      pointBorderWidth: size,
    };

    var speedData = {
      labels: range.map((x) => `${x.getDate()}/${x.getMonth() + 1}`),
      datasets: [dataFirst, dataSecond, dataThird],
    };

    var chartOptions = {
      legend: {
        display: false,
        position: 'top',
      },
    };

    this.chart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: speedData,
      options: chartOptions,
    });
  }

  expenseChart: Chart;
  incomeChart;
  categoryCharts: {
    expensesCategory: Chart;
    incomesCategory: Chart;
  } = {
    expensesCategory: null,
    incomesCategory: null,
  };

  drawCategoryData(
    element: 'expensesCategory' | 'incomesCategory',
    d: CategoryStat[]
  ) {
    const canvas = document.getElementById(element) as any;
    const ctx = canvas.getContext('2d');

    this.categoryCharts[element]?.destroy();
    const data = {
      labels: d.map((x) => x.categoryName),
      datasets: [
        {
          label: 'Expenses by category',
          data: d.map((x) => x.totalAmount),
          backgroundColor: d.map((x) => this.getRandomColor()),
          hoverOffset: 4,
        },
      ],
    };

    const config = {
      type: 'pie',
      data: data,
    };

    this.categoryCharts[element] = new Chart(canvas, {
      type: 'pie',
      hover: false,
      data: data,
      options: config,
    });
  }

  getRandomColor(min = 0, max = 255): string {
    const randomBetween = (min, max) =>
      min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(min, max);
    const g = randomBetween(min, max);
    const b = randomBetween(min, max);
    return `rgb(${r},${g},${b})`;
  }
  getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
}
