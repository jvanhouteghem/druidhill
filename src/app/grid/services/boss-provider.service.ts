import { Injectable } from '@angular/core';
import {Boss} from '../models/characters/boss';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import { RaidProviderService } from './raid-provider.service';
import { RaidDmgService } from './raid-dmg.service';

@Injectable()
export class BossProviderService {

  boss:Boss;

  constructor(
    private raidProviderService:RaidProviderService,
    private raidDmgService:RaidDmgService
    ) { 
    this.initBoss();
  }

  initBoss(){
    this.boss = new Boss("THEBOSS", 100000, "Normal");
  }

  getBoss(){
    return this.boss;
  }

  startRaidDmgOnBoss(){
    this.initializeHealthBar();
    let subscription: Subscription;
    let timer = Observable.timer(1000,500);
    subscription = timer.subscribe(t=> {
      let raidAliveLength = this.raidProviderService.getNbHeroAlive();
      let minRaidDmg = 10 * raidAliveLength;
      let maxRaidDmg = 35 * raidAliveLength;
      let raidFinalDmg = Math.floor((Math.random() * maxRaidDmg) + minRaidDmg);
      this.getBoss().setDmgTaken(this.getBoss().getDmgTaken() + raidFinalDmg)
      this.updateHealthBar(this.getBoss().getCurrentHealthInPercent());
    });
  }

  initializeHealthBar(){
    var elem = document.getElementById("bossHealthBar");
    elem.style.width = '100%';
  }

  updateHealthBar(healthInPercent){
    var elem = document.getElementById("bossHealthBar");
    elem.style.width = healthInPercent + '%';
  }

  // =======================
  // Boss attacks
  // =======================

  doBossPattern() {
    let boss = this.getBoss();
    // Interval
    let subscription: Subscription;
    let timer = Observable.timer(1000, 1000);
    subscription = timer.subscribe(t => {
      // If boss is dead then stop
      if (boss.isDead() || this.raidProviderService.isWipe()) {
        subscription.unsubscribe();
      } else {
        // Main attack
        let tankIfAliveOrElseHero = this.raidProviderService.getTankIfAliveOrElseHero();
        if (tankIfAliveOrElseHero != null) {
          boss.setFocus(tankIfAliveOrElseHero);
          this.raidDmgService.changeHeroHealth(tankIfAliveOrElseHero, 2000);
        }

        // Secondary attack (every n seconds) // attackonly alive person
        let randomHero = this.raidProviderService.getRandomAliveHero();
        if (randomHero != null) {
          this.raidDmgService.changeHeroHealth(randomHero, 1000);
        }

        // Thrid attack (every n seconds)
        randomHero = this.raidProviderService.getRandomAliveHero();
        if (randomHero != null) {
          this.raidDmgService.changeHeroHealth(randomHero, 500);
        }
      }
    });
  }

}
