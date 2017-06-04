import { Component, OnInit } from '@angular/core';
import {RaidProviderService} from './services/raid-provider.service';
import {RaidDmgService} from './services/raid-dmg.service';
import {BossProviderService} from './services/boss-provider.service';
import {Hero} from './models/hero';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

// Only for event and display
  constructor (
    private raidProviderService:RaidProviderService,
    private raidDmgService: RaidDmgService,
    private bossProviderService:BossProviderService
  ) { 'ngInject'; }

  ngOnInit () {
    this.raidProviderService.generateRaid();//.then(()=>this.t=setInterval(this.doDmg,1000));
    this.raidDmgService.doBossPattern(this.bossProviderService.getBoss());
  }

  _getRaid(){
    return this.raidProviderService.getRaid();
  }

  getCSSGradient(heroId:number){
    let hero = this.raidDmgService._getRaid()[heroId];
    return "linear-gradient(0deg, " + hero.getClassColor() + " " + this._getHeroHealthInPercent(hero.getId()) + "%, #4a4a4a 0%)"; // Warning, don't add ";" in string // life / background
  }

  _changeHeroHealth(hero: Hero,inputNb: number){
    this.raidDmgService.changeHeroHealth(hero, inputNb);
  }

  _getHeroHealthInPercent(heroId:number){
    return this.raidDmgService._getRaid()[heroId].getCurrentHealthInPercent();
  }

  leftClickOnHero(evt, heroId){
    let hero = this.raidDmgService._getRaid()[heroId];
    /*if (evt.altKey == true){
      console.log("left + alt");
      this.raidDmgService.lifebloom(heroId);
    }       
    else if (evt.ctrlKey == true){
      this.raidDmgService.changeHeroHealthOnTime(hero, 1000);
      console.log("left + ctrl");
    }
    else {*/
      this._changeHeroHealth(hero,-1000);
    //}
  }

  rightClickOnHero(evt, heroId){
    this.raidDmgService.lifebloom(heroId);
  }

}
