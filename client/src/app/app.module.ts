import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketService } from './socket.service';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SecretMenuComponent } from './secret-menu/secret-menu.component';
import { HttpService } from './http.service';


@NgModule({
  declarations: [
    AppComponent,
    SecretMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [SocketService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
