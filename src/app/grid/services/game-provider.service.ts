import { Injectable } from '@angular/core';
import { RaidProviderService } from './raid-provider.service';
import { RaidDmgService } from './raid-dmg.service';
import { BossProviderService } from './boss-provider.service';
import { PlayerProviderService } from './player-provider.service';
import { SpellProviderService } from './spell-provider.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import * as moment from 'moment/moment';

@Injectable()
export class GameProviderService {

  private subscription: Subscription;
  private timer = Observable.timer(0, 500);
  private pause: any;

  constructor(
    private raidProviderService: RaidProviderService,
    private raidDmgService: RaidDmgService,
    private bossProviderService: BossProviderService,
    private playerProviderService: PlayerProviderService,
    private spellProviderService: SpellProviderService
  ) { 
    this.pause = {duration : 0, isPause : false};
  }

  startGame() {
    this.playerProviderService.setPlayer("Lea", 20000, 15500);
    this.raidProviderService.generateRaid();
    this.raidDmgService.doBossPattern(this.bossProviderService.getBoss());
    this.playerProviderService.startPlayerManaRegen();
    this.initializeHealthBar();
    this.initializeManaBar();
    
    //this.togglePause();
  }

  togglePause(){
    if (this.pause.isPause === false){
      this.pause.isPause = true;
      this.pause.duration = 0;
      this.subscription = this.timer.subscribe(t => {
        this.pause.duration += 500;
      });
    } else {
      this.pause.isPause = false;
      this.subscription.unsubscribe();
    }
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
