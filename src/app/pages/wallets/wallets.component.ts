import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../modules/core/services/wallet.service';
import { WalletOverview } from '../../modules/shared/models';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewWalletPopupComponent } from '../../modules/shared/components/new-wallet-popup/new-wallet-popup.component';
import { ECurrency } from '../../modules/shared/enums';
import { NotificationService } from '../../modules/core/services/notification.service';
import { ConfirmPopupComponent } from '../../modules/shared/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit {
  wallets: WalletOverview[] = [];
  constructor(
    private walletService: WalletService,
    public modalService: NgbModal,
    private notifyService: NotificationService
  ) {}

  public currenciesDict = {
    [ECurrency.USD]: 'USD',
    [ECurrency.BYN]: 'BYN',
    [ECurrency.EUR]: 'EUR',
  };

  ngOnInit(): void {
    this.loadWallets();
  }

  createNewWallet() {
    const modalRef = this.modalService.open(NewWalletPopupComponent, {
      centered: true,
    });

    modalRef.componentInstance.confirmed.subscribe(() => {
      this.loadWallets();
    });
  }

  loadWallets() {
    this.walletService.getAllUserWallets().subscribe((x) => (this.wallets = x));
  }

  edit(wallet: WalletOverview) {
    const modalRef = this.modalService.open(NewWalletPopupComponent, {
      centered: true,
    });

    modalRef.componentInstance.data = wallet;

    modalRef.componentInstance.confirmed.subscribe(() => {
      this.loadWallets();
    });
  }
  delete(id: number) {
    const modalRef = this.modalService.open(ConfirmPopupComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      'Are you sure you want to delete this wallet? All associated transaction will be deleted';

    modalRef.componentInstance.confirmed.subscribe(() => {
      this.walletService.delete(id).subscribe(() => {
        this.notifyService.showInfo('Deleted wallet');
        this.loadWallets();
      });
    });
  }
}
