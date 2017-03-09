import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FoonumComponent } from './foonum/foonum.component';
import { BitcoreComponent } from './bitcore/bitcore.component';
import { AmockComponent } from './amock/amock.component';

@NgModule({
  declarations: [
    AppComponent,
    FoonumComponent,
    BitcoreComponent,
    AmockComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
