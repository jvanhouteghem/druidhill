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
import { Boss } from '../models/characters/boss';

@Injectable()
export class GameProviderService extends Pause{

  constructor(
    private raidProviderService: RaidProviderService,
    private bossProviderService: BossProviderService,
    private playerProviderService: PlayerProviderService,
    private raidDmgService: RaidDmgService
  ) { 
    'ngInject';
    super();
  }

  startGame() {
    this.playerProviderService.setPlayer("Lea", 20000, 15500);
    this.raidProviderService.generateRaid();
    this.bossProviderService.setBoss(new Boss("THEBOSS", 100000, "normal"));
    this.bossProviderService.doBossPattern();
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
