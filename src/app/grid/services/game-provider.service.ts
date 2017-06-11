import { Injectable } from '@angular/core';
import {RaidProviderService} from './raid-provider.service';
import {RaidDmgService} from './raid-dmg.service';
import {BossProviderService} from './boss-provider.service';
import {PlayerProviderService} from './player-provider.service';
import {SpellProviderService} from './spell-provider.service';

@Injectable()
export class GameProviderService {

  constructor(
    private raidProviderService:RaidProviderService,
    private raidDmgService: RaidDmgService,
    private bossProviderService:BossProviderService,
    private playerProviderService:PlayerProviderService,
    private spellProviderService:SpellProviderService
  ) { }

  startGame(){
    this.playerProviderService.setPlayer("Lea", 20000, 15500);
    this.raidProviderService.generateRaid();
    this.raidDmgService.doBossPattern(this.bossProviderService.getBoss());
    //this.isLoadingSpell = false;
    this.playerProviderService.startPlayerManaRegen();
    this.initializeHealthBar();
    this.initializeManaBar();
  }


  initializeHealthBar(){
    var elem = document.getElementById("healthBar");
    elem.style.width = '100%';
  }

  initializeManaBar(){
    var elem = document.getElementById("manaBar");
    elem.style.width = '100%';
  }

}
