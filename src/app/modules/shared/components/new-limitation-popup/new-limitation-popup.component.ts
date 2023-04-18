import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WalletService } from '../../../core/services/wallet.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ECurrency } from '../../enums';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryInfo } from '../../models/category-info';
import { ETransactionType } from '../../enums/etransaction-type';
import { WalletOverview } from '../../models';
import { WalletLimitationService } from '../../../core/services/wallet-limitation.service';
import { Observable, of } from 'rxjs';
import { CreateRegularTransactionCommand } from '../../models/create-regular-transaction-command';
import { CreateTransactionCommand } from '../../models/create-transaction-command';
import { CreateLimitationCommand } from '../../models/create-limitition-command';

interface NewLimitationFg {
  amount: FormControl<number>;
  categoryId: FormControl<number>;
  categoryName: FormControl<string>;
  walletId: FormControl<number>;
  walletName: FormControl<string>;
}
@Component({
  selector: 'app-new-limitation-popup',
  templateUrl: './new-limitation-popup.component.html',
  styleUrls: ['./new-limitation-popup.component.scss'],
})
export class NewLimitationPopupComponent {
  @Output() confirmed: EventEmitter<any> = new EventEmitter();
  form: FormGroup<NewLimitationFg>;
  categories: CategoryInfo[];
  walletsData: WalletOverview[];
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private walletService: WalletService,
    private notifyService: NotificationService,
    private categoryService: CategoryService,
    private walletLimitationService: WalletLimitationService
  ) {
    this.form = this.fb.group<NewLimitationFg>({
      amount: new FormControl<number>(0, [
        Validators.required,
        Validators.min(0),
      ]),
      walletId: new FormControl<number>(null),
      categoryId: new FormControl<number>(null),
      walletName: new FormControl<string>('All wallets'),
      categoryName: new FormControl<string>('All categories'),
    });

    this.form.controls.amount.valueChanges.subscribe((x) => {
      x !== null &&
        this.form.controls.amount.patchValue(Math.round(x * 100) / 100, {
          emitEvent: false,
        });
    });

    this.categoryService.getAll().subscribe((x) => {
      this.categories = [
        null,
        ...x.filter((x) => x.type === ETransactionType.Expense),
      ];
    });

    this.walletService.getAllUserWallets().subscribe((x) => {
      this.walletsData = [null, ...x];
    });
  }

  close() {
    this.activeModal.close();
  }

  save() {
    const value = this.form.value as CreateLimitationCommand;

    this.walletLimitationService.create(value).subscribe(() => {
      this.notifyService.showSuccess('Successfully created');
      this.confirmed.emit();
      this.activeModal.close();
    });
  }
}
