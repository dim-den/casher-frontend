import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../core/services';
import { NotificationService } from '../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, debounceTime, take } from 'rxjs';

interface ResetFg {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  code: FormControl<string>;
}
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
@UntilDestroy()
export class ResetPasswordComponent {
  form: FormGroup<ResetFg>;
  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group<ResetFg>({
      password: this.fb.control(null, [Validators.required]),
      confirmPassword: this.fb.control(null, [Validators.required]),
      code: this.fb.control(null, [Validators.required]),
    });

    combineLatest(
      this.form.controls.confirmPassword.valueChanges,
      this.form.controls.password.valueChanges
    )
      .pipe(untilDestroyed(this), debounceTime(250))
      .subscribe(([cp, p]) => {
        if (cp && p && cp !== p) {
          this.errorMsg = 'Password doesn`t match confirm password';
        } else {
          this.errorMsg = null;
        }
      });

    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      if (params) {
        this.form.controls.code.patchValue(params.code);
      }
    });
  }
  errorMsg = null;
  send() {
    const value = this.form.value;
    this.authService.resetPassword(value).subscribe((x) => {
      if (x && 'Error' in x) {
        this.errorMsg = x.Error;

        this.form.valueChanges
          .pipe(take(1))
          .subscribe(() => (this.errorMsg = null));
      } else {
        this.notifyService.showInfo('Password changed.');
        this.form.reset();
        this.form.markAsUntouched();
      }
    });
  }

  navigateToLogin() {
    void this.router.navigate(['auth', 'login']);
  }
}
