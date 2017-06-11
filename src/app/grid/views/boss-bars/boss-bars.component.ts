import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import { BossProviderService } from './../../services/boss-provider.service';
import { RaidProviderService } from './../../services/raid-provider.service';

@Component({
  selector: 'app-boss-bars',
  templateUrl: './boss-bars.component.html',
  styleUrls: ['./boss-bars.component.css']
})
export class BossBarsComponent implements OnInit {

  constructor(
    private bossProviderService:BossProviderService,
    private raidProviderService:RaidProviderService
  ) { }

  ngOnInit() {
    this.initializeHealthBar();
    this.startRaidDmgOnBoss();
  }

  startRaidDmgOnBoss(){
    let subscription: Subscription;
    let timer = Observable.timer(1000,500);
    let count = 0;
    subscription = timer.subscribe(t=> {
      let raidLength = this.raidProviderService.getRaid().length;
      let minRaidDmg = 10 * raidLength;
      let maxRaidDmg = 35 * raidLength;
      let raidFinalDmg = Math.floor((Math.random() * maxRaidDmg) + minRaidDmg);
      this.bossProviderService.getBoss().setDmgTaken(this.bossProviderService.getBoss().getDmgTaken() + raidFinalDmg)
      this.updateHealthBar(this.bossProviderService.getBoss().getCurrentHealthInPercent());
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

  _getBossCurrentHealth(){
    return this.bossProviderService.getBoss().getCurrentHealth();
  }

  _getBossBaseHealth(){
    return this.bossProviderService.getBoss().getBaseHealth();
  }

}
