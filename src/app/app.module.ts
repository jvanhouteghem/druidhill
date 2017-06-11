import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RaidProviderService} from './grid/services/raid-provider.service';
import {RaidDmgService} from './grid/services/raid-dmg.service';
import {BossProviderService} from './grid/services/boss-provider.service';
import {PlayerProviderService} from './grid/services/player-provider.service';
import {SpellProviderService} from './grid/services/spell-provider.service';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';

import { routes } from './app.router';
import { SpellIconsComponent } from './grid/views/spell-icons/spell-icons.component';
import { PlayerBarsComponent } from './grid/views/player-bars/player-bars.component';
import { BossBarsComponent } from './grid/views/boss-bars/boss-bars.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    SpellIconsComponent,
    PlayerBarsComponent,
    BossBarsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routes
  ],
  providers: [RaidProviderService, RaidDmgService, BossProviderService, PlayerProviderService, SpellProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
