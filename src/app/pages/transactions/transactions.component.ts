import { Component } from '@angular/core';
import { NewWalletPopupComponent } from '../../modules/shared/components/new-wallet-popup/new-wallet-popup.component';
import { NewTransactionPopupComponent } from '../../modules/shared/components/new-transaction-popup/new-transaction-popup.component';
import { WalletService } from '../../modules/core/services/wallet.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../modules/core/services/notification.service';
import { TransactionService } from '../../modules/core/services/transaction.service';
import { TransactionOverview } from '../../modules/shared/models/transaction-overview';
import { Observable, of } from 'rxjs';
import { DateTime } from '../../modules/core/constants';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  transactions: TransactionOverview[];

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
      const s = DateTime.Now.startOf('month').toDate();
      const e = DateTime.Now.endOf('month').toDate();
      this.transactionService
        .getTransactions(this.walletService.selectedWallet$.value.id, s, e)
        .subscribe((x) => {
          this.transactions = x;
        });
    });
  }

  createTransaction() {
    const modalRef = this.modalService.open(NewTransactionPopupComponent, {
      centered: true,
    });

    modalRef.componentInstance.confirmed.subscribe(() => {
      //this.loadWallets();
    });
  }
}
