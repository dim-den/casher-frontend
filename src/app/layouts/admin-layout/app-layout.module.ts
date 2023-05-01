import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutes, CommonRoutes } from './app-layout.routing';

import { UserComponent } from '../../pages/user/user.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([...CommonRoutes, ...AuthRoutes]),
    FormsModule,
    NgbModule,
    FlexModule,
    ReactiveFormsModule,
  ],
  declarations: [UserComponent],
})
export class AppLayoutModule {}
