import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RaidProviderService} from './grid/services/raid-provider.service';
import {RaidDmgService} from './grid/services/raid-dmg.service';
import {BossProviderService} from './grid/services/boss-provider.service';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';

import { routes } from './app.router';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routes
  ],
  providers: [RaidProviderService, RaidDmgService, BossProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
