import { Injectable } from '@angular/core';
import {Boss} from '../models/characters/boss';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import { RaidProviderService } from './raid-provider.service';

@Injectable()
export class BossProviderService {

  boss:Boss;

  constructor(private raidProviderService:RaidProviderService) { 
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

}
