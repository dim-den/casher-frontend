import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  HubConnection,
  HubConnectionBuilder,
  IHttpConnectionOptions,
  LogLevel,
} from '@microsoft/signalr';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../../environments/environment';
import { UnreadNotification } from '../../shared/models/unread-notification';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
@UntilDestroy()
export class NotificationService {
  private connection: HubConnection;

  public unreadNotifications$ = new BehaviorSubject<UnreadNotification[]>([]);
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) {
    combineLatest([this.authService.currentUser$])
      .pipe(untilDestroyed(this))
      .subscribe(([accessData]) => {
        if (accessData == null) {
          void this.connection?.stop();
          this.connection = null;
        } else {
          const options: IHttpConnectionOptions = {
            accessTokenFactory: () => accessData.bearerToken,
            withCredentials: false,
          };
          this.setupSignalR(options, environment.endpoint);
        }
      });
  }

  public markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`/notification/read`, {
      notificationId,
    });
  }

  private setupSignalR(
    options: IHttpConnectionOptions,
    apiEndpoint: string
  ): void {
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.None)
      .withUrl(`${apiEndpoint}/notifications`, options)
      .withAutomaticReconnect()
      .build();

    this.connection.on('showSuccess', (message: string) => {
      this.showSuccess(message);
    });
    this.connection.on('showInfo', (message: string) => {
      this.showInfo(message);
    });
    this.connection.on('showError', (message: string) => {
      this.showError(message);
    });

    this.connection.on('regularTransaction', (message: string) => {
      this.showError(message);
    });

    this.connection.on('regularTransaction', (message: string) => {
      this.showError(message);
    });

    this.connection.on('unread', (message: string) => {
      console.log(message);
      const notifications = JSON.parse(message) as UnreadNotification[];
      this.unreadNotifications$.next(notifications);
      console.log(notifications);
    });

    void this.connection.start();
  }

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
