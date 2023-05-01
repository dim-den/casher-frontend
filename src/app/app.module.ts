import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutes, AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppLayoutComponent } from './layouts/admin-layout/app-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from './modules/core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { WalletsComponent } from './pages/wallets/wallets.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { SharedModule } from './modules/shared/shared.module';
import { SearchComponent } from './pages/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    WelcomeComponent,
    WalletsComponent,
    TransactionsComponent,
    SearchComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {}),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    CoreModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
