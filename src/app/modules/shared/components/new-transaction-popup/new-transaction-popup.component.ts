import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EPeriodicityType } from '../../enums/eperiodicity-type';
import { ETransactionType } from '../../enums/etransaction-type';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { RegularTransactionService } from '../../../core/services/regular-transaction.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CreateRegularTransactionCommand } from '../../models/create-regular-transaction-command';
import { CreateTransactionCommand } from '../../models/create-transaction-command';
import { WalletService } from '../../../core/services/wallet.service';
import { TransactionOverview } from '../../models/transaction-overview';
import { Observable, of } from 'rxjs';
import { DateTime } from '../../../core/constants';

interface NewTransactionFg {
  amount: FormControl<number>;
  description: FormControl<string>;
  categoryId: FormControl<number>;
  categoryName: FormControl<string>;
  dateFormatted: FormControl<{ day: number; month: number; year: number }>;
  type: FormControl<ETransactionType>;
  isRegular: FormControl<boolean>;
  periodicityType: FormControl<EPeriodicityType>;
}
@Component({
  selector: 'app-new-transaction-popup',
  templateUrl: './new-transaction-popup.component.html',
  styleUrls: ['./new-transaction-popup.component.scss'],
})
export class NewTransactionPopupComponent implements AfterViewInit {
  @Output() confirmed: EventEmitter<any> = new EventEmitter();

  form: FormGroup<NewTransactionFg>;

  transactionType = ETransactionType;

  data: TransactionOverview;
  public categoriesDict = {};

  periodicityDict = {
    [EPeriodicityType.Daily]: 'Daily',
    [EPeriodicityType.Weekly]: 'Weekly',
    [EPeriodicityType.Monthly]: 'Monthly',
    [EPeriodicityType.Yearly]: 'Yearly',
  };

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private regularTransactionService: RegularTransactionService,
    private categoryService: CategoryService,
    private notifyService: NotificationService,
    private walletsService: WalletService
  ) {
    const date = new Date();
    this.form = this.fb.group<NewTransactionFg>({
      amount: new FormControl<number>(1, [
        Validators.required,
        Validators.min(1),
      ]),
      description: new FormControl<string>(null, [Validators.maxLength(256)]),
      categoryId: new FormControl(null, [Validators.required]),
      dateFormatted: new FormControl(
        {
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
        [Validators.required]
      ),
      type: new FormControl<ETransactionType>(ETransactionType.Expense, [
        Validators.required,
      ]),
      isRegular: new FormControl(false),
      periodicityType: new FormControl(null),
      categoryName: new FormControl('Not selected'),
    });

    this.categoryService.getAll().subscribe((x) => {
      const expsenseCat = x.filter((x) => x.type === ETransactionType.Expense);
      const incomeCat = x.filter((x) => x.type === ETransactionType.Income);

      this.categoriesDict[ETransactionType.Expense] = expsenseCat;
      this.categoriesDict[ETransactionType.Income] = incomeCat;
    });

    this.form.controls.dateFormatted.valueChanges.subscribe((x) => {
      if (!x.year || !x.day || !x.month) {
        this.form.controls.dateFormatted.setErrors({});
      } else {
        this.form.controls.dateFormatted.setErrors(null);
      }
    });

    this.form.controls.type.valueChanges.subscribe(() => {
      this.form.patchValue({
        categoryName: 'Not selected',
        categoryId: null,
      });
    });

    this.form.controls.isRegular.valueChanges.subscribe((x) => {
      if (x) {
        this.form.controls.periodicityType.patchValue(EPeriodicityType.Monthly);
      } else {
        this.form.controls.periodicityType.patchValue(null);
      }
    });

    if (!this.walletsService.selectedWallet$.value) {
      this.walletsService.getAllUserWallets().subscribe();
    }
  }

  get editMode(): boolean {
    return !!this.data;
  }

  ngAfterViewInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
      const date = DateTime.moment(this.data.date).toDate();

      this.form.controls.type.patchValue(this.data.category.type);
      this.form.controls.categoryId.patchValue(this.data.category.id);
      this.form.controls.categoryName.patchValue(this.data.category.name);
      this.form.controls.dateFormatted.patchValue({
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
    }
  }
  save() {
    const value = this.form.value;
    // @ts-ignore
    value.date = new Date(
      value.dateFormatted.year,
      value.dateFormatted.month - 1,
      value.dateFormatted.day
    );
    // @ts-ignore
    value.start = value.date;
    // @ts-ignore
    value.walletId = this.walletsService.selectedWallet$.value.id;

    let request: Observable<any> = of(null);
    if (!this.editMode) {
      request = value.isRegular
        ? this.regularTransactionService.create(
            value as CreateRegularTransactionCommand
          )
        : this.transactionService.create(value as CreateTransactionCommand);
    } else {
      request = this.transactionService.update(
        this.data.id,
        value as CreateTransactionCommand
      );
    }

    request.subscribe(() => {
      this.notifyService.showSuccess('Successfully created');
      this.confirmed.emit();
      this.activeModal.close();
    });
  }

  delete() {
    this.transactionService.delete(this.data.id).subscribe(() => {
      this.notifyService.showInfo('Successfully deleted');
      this.confirmed.emit();
      this.activeModal.close();
    });
  }

  close() {
    this.activeModal.close();
  }
}
