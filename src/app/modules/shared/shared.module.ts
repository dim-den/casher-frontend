import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewWalletPopupComponent } from './components/new-wallet-popup/new-wallet-popup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';

@NgModule({
  declarations: [NewWalletPopupComponent, ConfirmPopupComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgbDropdownModule,
  ],
  exports: [NewWalletPopupComponent, ConfirmPopupComponent],
})
export class SharedModule {}
