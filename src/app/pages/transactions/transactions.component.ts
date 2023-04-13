import { Component } from '@angular/core';
import { NewTransactionPopupComponent } from '../../modules/shared/components/new-transaction-popup/new-transaction-popup.component';
import { WalletService } from '../../modules/core/services/wallet.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../modules/core/services/notification.service';
import { TransactionService } from '../../modules/core/services/transaction.service';
import { TransactionOverview } from '../../modules/shared/models/transaction-overview';
import { debounceTime, of, skip } from 'rxjs';
import { DateTime } from '../../modules/core/constants';
import { ETransactionType } from '../../modules/shared/enums/etransaction-type';

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

  constructor(
    private walletService: WalletService,
    private transactionService: TransactionService,
    public modalService: NgbModal,
    private notifyService: NotificationService
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
  }

  getTransactionsForSelectedDate() {
    const s = DateTime.moment(this.selectedDate).startOf('month').toDate();
    const e = DateTime.moment(this.selectedDate).endOf('month').toDate();
    this.transactionService
      .getTransactions(this.walletService.selectedWallet$.value.id, s, e)
      .subscribe((x) => {
        this.transactions = x;

        const groupedByDay = x.reduce((accumulator, currentValue) => {
          const date = new Date(currentValue.date);
          const day = date.getDate();

          if (!accumulator[day]) {
            accumulator[day] = [];
          }

          accumulator[day].push(currentValue);

          return accumulator;
        }, {});

        this.transactionGroupedByDay = Object.entries(groupedByDay).map(
          ([day, transactions]) => ({ key: day, value: transactions })
        );
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
    });
  }

  editTransaction(transaction: TransactionOverview) {
    const modalRef = this.modalService.open(NewTransactionPopupComponent, {
      centered: true,
    });

    modalRef.componentInstance.data = transaction;

    modalRef.componentInstance.confirmed.subscribe(() => {
      this.getTransactionsForSelectedDate();
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
    this.getTransactionsForSelectedDate();
  }
}
