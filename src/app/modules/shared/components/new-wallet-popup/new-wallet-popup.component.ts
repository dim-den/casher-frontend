import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ECurrency } from '../../enums';
import { WalletService } from '../../../core/services/wallet.service';
import { CreateWalletCommand } from '../../models/create-wallet-command';
import { NotificationService } from '../../../core/services/notification.service';
import { WalletOverview } from '../../models';

interface NewWalletFg {
  name: FormControl<string>;
  balance: FormControl<number>;
  currency: FormControl<ECurrency>;
  isDefault: FormControl<boolean>;
}
@Component({
  selector: 'app-new-wallet-popup',
  templateUrl: './new-wallet-popup.component.html',
  styleUrls: ['./new-wallet-popup.component.scss'],
})
export class NewWalletPopupComponent implements AfterViewInit {
  @Output() confirmed: EventEmitter<any> = new EventEmitter();

  form: FormGroup<NewWalletFg>;

  data: WalletOverview;

  title: string;
  message: string;

  public currencies = [
    { value: ECurrency.USD, viewValue: 'USD' },
    { value: ECurrency.BYN, viewValue: 'BYN' },
    { value: ECurrency.EUR, viewValue: 'EUR' },
  ];

  public currenciesDict = {
    [ECurrency.USD]: 'USD',
    [ECurrency.BYN]: 'BYN',
    [ECurrency.EUR]: 'EUR',
  };

  get editMode(): boolean {
    return !!this.data;
  }
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private walletService: WalletService,
    private notifyService: NotificationService
  ) {
    this.form = this.fb.group<NewWalletFg>({
      balance: new FormControl<number>(0, [
        Validators.required,
        Validators.min(0),
      ]),
      name: new FormControl<string>(null, [
        Validators.required,
        Validators.maxLength(64),
      ]),
      currency: new FormControl<ECurrency>(ECurrency.BYN, [
        Validators.required,
      ]),
      isDefault: new FormControl(false),
    });

    this.form.controls.balance.valueChanges.subscribe((x) => {
      x !== null &&
        this.form.controls.balance.patchValue(Math.round(x * 100) / 100, {
          emitEvent: false,
        });
    });
  }

  save() {
    const value = this.form.value as CreateWalletCommand;
    const request = this.editMode
      ? this.walletService.update(this.data.id, value)
      : this.walletService.create(value);

    request.subscribe(() => {
      this.notifyService.showSuccess(
        this.editMode ? 'Successfully updated' : 'Successfully created'
      );
      this.confirmed.emit();
      this.activeModal.close();
    });
  }

  close() {
    this.activeModal.close();
  }

  ngAfterViewInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
}
