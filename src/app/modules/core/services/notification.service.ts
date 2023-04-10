import { UntilDestroy } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
@UntilDestroy()
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  private showNotification(
    message: string,
    type: 'info' | 'success' | 'warning' | 'danger'
  ) {
    this.toastr.show(
      `<span data-notify='icon' class='nc-icon nc-bell-55'></span><span data-notify='message'>${message}</span>`,
      '',
      {
        timeOut: 4000,
        closeButton: true,
        enableHtml: true,
        toastClass: `alert alert-${type} alert-with-icon`,
        positionClass: 'toast-bottom-right',
      },
      type
    );
  }

  showSuccess(message: string): void {
    this.showNotification(message, 'success');
  }

  showError(message: string): void {
    this.showNotification(message, 'danger');
  }

  showInfo(message: string): void {
    this.showNotification(message, 'info');
  }

  showWarning(message: string): void {
    this.showNotification(message, 'warning');
  }
}
