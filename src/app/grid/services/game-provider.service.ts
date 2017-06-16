import { Injectable } from '@angular/core';
import { RaidProviderService } from './raid-provider.service';
import { RaidDmgService } from './raid-dmg.service';
import { BossProviderService } from './boss-provider.service';
import { PlayerProviderService } from './player-provider.service';
import { SpellProviderService } from './spell-provider.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment/moment';
import {Pause} from '../models/pause';

@Injectable()
export class GameProviderService extends Pause{

  /*private subscription: Subscription;
  private timer = Observable.timer(0, 500);
  private pause: any;*/

  constructor(
    private raidProviderService: RaidProviderService,
    private bossProviderService: BossProviderService,
    private playerProviderService: PlayerProviderService,
    private raidDmgService: RaidDmgService
    //private spellProviderService: SpellProviderService
  ) { 
    'ngInject';
    super();
  }

  startGame() {
    this.playerProviderService.setPlayer("Lea", 20000, 15500);
    this.raidProviderService.generateRaid();
    this.raidDmgService.doBossPattern(this.bossProviderService.getBoss());
    this.playerProviderService.startPlayerManaRegen();
    this.initializeHealthBar();
    this.initializeManaBar();    
  }

  initializeHealthBar() {
    var elem = document.getElementById("healthBar");
    elem.style.width = '100%';
  }

  initializeManaBar() {
    var elem = document.getElementById("manaBar");
    elem.style.width = '100%';
  }

}
