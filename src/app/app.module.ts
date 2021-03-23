import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DiscountModule } from './generate-discount/discount.module';


import { LoginPageComponent } from './login-page/login-page.component';
import { AppConfig } from 'src/app.config';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: LoginPageComponent},
      {path: 'welcome', redirectTo: '', pathMatch: 'full'},
      
    ]),
    ReactiveFormsModule,
    HttpClientModule,
    DiscountModule
  ],
  providers: [
    AppConfig,
    {
      provide : APP_INITIALIZER,
      useFactory : initializeApp,
      deps:[AppConfig], multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
