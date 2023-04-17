import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ECurrency } from '../../shared/enums';
import { AuthenticationService } from '../../core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  combineLatest,
  combineLatestWith,
  debounceTime,
  first,
  merge,
  take,
} from 'rxjs';
import { Credential } from '../../shared/models/credential';
import { Registration } from '../../shared/models/registration';
import { ErrorResponse } from '../../shared/models/error-response';

export interface RegisterFg {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  walletCurrencyId: FormControl<ECurrency>;
  walletBalance: FormControl<number>;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
@UntilDestroy()
export class RegistrationComponent implements OnInit {
  public form: FormGroup<RegisterFg>;

  public errorMsg = '';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  register() {
    const value = this.form.value as Registration;
    this.authService
      .register(value)
      .pipe(first())
      .subscribe((x) => {
        if ('Error' in x) {
          this.errorMsg = x.Error;

          this.form.valueChanges
            .pipe(take(1))
            .subscribe(() => (this.errorMsg = null));
        } else {
          void this.router.navigate(['wallets']);
        }
      });
  }

  navigateToLogin() {
    void this.router.navigate(['auth', 'login']);
  }

  ngOnInit(): void {
    this.form = this.fb.group<RegisterFg>({
      firstname: this.fb.control(null, [
        Validators.required,
        Validators.maxLength(64),
      ]),
      lastname: this.fb.control(null, [
        Validators.required,
        Validators.maxLength(64),
      ]),
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [Validators.required]),
      confirmPassword: this.fb.control(null, [Validators.required]),
      walletCurrencyId: this.fb.control(ECurrency.BYN),
      walletBalance: this.fb.control(0, [
        Validators.required,
        Validators.min(0),
      ]),
    });

    this.form.controls.walletBalance.valueChanges.subscribe((x) => {
      x !== null &&
        this.form.controls.walletBalance.patchValue(Math.round(x * 100) / 100, {
          emitEvent: false,
        });
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
  }
}
