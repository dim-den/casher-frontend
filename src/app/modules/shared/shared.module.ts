import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewWalletPopupComponent } from './components/new-wallet-popup/new-wallet-popup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import { NewTransactionPopupComponent } from './components/new-transaction-popup/new-transaction-popup.component';
import { ValueSignLightningTsPipe } from './pipes/value-sign-lightning.ts.pipe';
import { NgbSortableColumnDirective } from './directives/ngb-sortable-column.directive';
import { NewLimitationPopupComponent } from './components/new-limitation-popup/new-limitation-popup.component';

@NgModule({
  declarations: [
    NewWalletPopupComponent,
    ConfirmPopupComponent,
    NewTransactionPopupComponent,
    ValueSignLightningTsPipe,
    NgbSortableColumnDirective,
    NewLimitationPopupComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
  ],
  exports: [
    NewWalletPopupComponent,
    ConfirmPopupComponent,
    ValueSignLightningTsPipe,
    NgbSortableColumnDirective,
  ],
})
export class SharedModule {}
