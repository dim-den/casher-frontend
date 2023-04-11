import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss'],
})
export class ConfirmPopupComponent {
  @Output() confirmed: EventEmitter<any> = new EventEmitter();

  message =
    'Are you sure about performing the operation? Result cannot be returned';
  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.confirmed.emit();
    this.activeModal.close();
  }

  close() {
    this.activeModal.close();
  }
}
