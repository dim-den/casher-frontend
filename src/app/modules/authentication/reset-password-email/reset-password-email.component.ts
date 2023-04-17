import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { AuthenticationService } from '../../core/services';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.scss'],
})
export class ResetPasswordEmailComponent {
  emailCtrl: FormControl<string>;
  form: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private router: Router
  ) {
    this.emailCtrl = this.fb.control(null, [
      Validators.required,
      Validators.email,
    ]);

    this.form = this.fb.group({
      email: this.emailCtrl,
    });
  }

  send() {
    this.authService
      .sendResetPasswordEmail({ email: this.emailCtrl.value })
      .subscribe(() => {
        this.notifyService.showInfo('Email was send. Check your messages');
      });
  }

  navigateToLogin() {
    void this.router.navigate(['auth', 'login']);
  }
}
