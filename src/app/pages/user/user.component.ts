import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../modules/core/services';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, take } from 'rxjs';
import { NotificationService } from '../../modules/core/services/notification.service';
import { UserService } from '../../modules/core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { WalletLimitationOverview } from '../../modules/shared/models/wallet-limitation-overview';
import { WalletLimitationService } from '../../modules/core/services/wallet-limitation.service';
import { NewWalletPopupComponent } from '../../modules/shared/components/new-wallet-popup/new-wallet-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewLimitationPopupComponent } from '../../modules/shared/components/new-limitation-popup/new-limitation-popup.component';
import { WalletService } from '../../modules/core/services/wallet.service';

export interface ChangePasswordFg {
  password: FormControl<string>;
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
}

export interface ProfileFg {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  emailConfirmed: FormControl<boolean>;
  registrationDate: FormControl<Date>;
  totalTransactions: FormControl<number>;
}

@Component({
  selector: 'user-cmp',
  moduleId: module.id,
  templateUrl: 'user.component.html',
  styleUrls: ['./user.component.scss'],
})
@UntilDestroy()
export class UserComponent implements OnInit {
  changePasswordForm: FormGroup<ChangePasswordFg>;
  profileFg: FormGroup<ProfileFg>;

  changePasswordErrorMsg = '';
  userLimitations: WalletLimitationOverview[] = [];
  constructor(
    public authService: AuthenticationService,
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private walletLimitationService: WalletLimitationService,
    public modalService: NgbModal,
    public walletsService: WalletService
  ) {
    this.profileFg = this.fb.group<ProfileFg>({
      firstName: this.fb.control(null),
      lastName: this.fb.control(null),
      email: this.fb.control(null),
      emailConfirmed: this.fb.control(null),
      registrationDate: this.fb.control(null),
      totalTransactions: this.fb.control(null),
    });
    this.profileFg.disable();

    this.changePasswordForm = this.fb.group<ChangePasswordFg>({
      password: this.fb.control(null, [Validators.required]),
      newPassword: this.fb.control(null, [Validators.required]),
      confirmNewPassword: this.fb.control(null, [Validators.required]),
    });

    this.userService.getInfo().subscribe((x) => {
      this.profileFg.patchValue(x);

      this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
        if (params.code && !this.profileFg.controls.emailConfirmed.value) {
          this.authService.confirmEmail(params.code).subscribe(() => {
            this.profileFg.controls.emailConfirmed.patchValue(true);
            this.notificationService.showSuccess(
              'Successfully confirmed email!'
            );
          });
        }
      });
    });

    this.loadUserLimitations();

    this.changePasswordForm.valueChanges
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe((x) => {
        if (
          x.newPassword &&
          x.confirmNewPassword &&
          x.newPassword !== x.confirmNewPassword
        ) {
          this.changePasswordErrorMsg =
            'Confirm password doesnt equal new password';
        } else {
          this.changePasswordErrorMsg = null;
        }
      });
  }

  resetPassword() {
    const value = this.changePasswordForm.value;
    this.authService.changePassword(value).subscribe((x) => {
      if (x && 'Error' in x) {
        this.changePasswordErrorMsg = x.Error;

        this.changePasswordForm.valueChanges
          .pipe(take(1))
          .subscribe(() => (this.changePasswordErrorMsg = null));
      } else {
        this.changePasswordForm.reset();
        this.notificationService.showSuccess('Successfully changed password');
      }
    });
  }

  disableConfirmEmail = false;

  sendConfirmEmail() {
    this.authService.sendConfirmEmail().subscribe(() => {
      this.disableConfirmEmail = true;
      this.notificationService.showInfo('Confirmation email was send');
    });
  }

  loadUserLimitations() {
    this.walletLimitationService
      .getUserLimitation()
      .subscribe((x) => (this.userLimitations = x));
  }

  deleteLimitation(id: number) {
    this.walletLimitationService.delete(id).subscribe(() => {
      this.loadUserLimitations();
      this.notificationService.showInfo('Deleted limitation');
    });
  }

  createUserLimitation() {
    const modalRef = this.modalService.open(NewLimitationPopupComponent, {
      centered: true,
    });

    modalRef.componentInstance.confirmed.subscribe(() => {
      this.loadUserLimitations();
    });
  }
  ngOnInit() {}
}
