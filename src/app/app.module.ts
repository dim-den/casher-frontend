import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AppRoutes, AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AdminLayoutComponent} from "./layouts/admin-layout/admin-layout.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {SidebarModule} from "./sidebar/sidebar.module";
import {NavbarModule} from "./shared/navbar/navbar.module";
import {FooterModule} from "./shared/footer/footer.module";
import {FixedPluginModule} from "./shared/fixedplugin/fixedplugin.module";
import { ToastrModule } from "ngx-toastr";

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes,{
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
