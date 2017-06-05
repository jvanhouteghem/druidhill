import { Component, OnInit } from '@angular/core';
import {RaidProviderService} from './services/raid-provider.service';
import {RaidDmgService} from './services/raid-dmg.service';
import {BossProviderService} from './services/boss-provider.service';
import {PlayerProviderService} from './services/player-provider.service';
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

    private isLoadingSpell;

// Only for event and display
  constructor (
    private raidProviderService:RaidProviderService,
    private raidDmgService: RaidDmgService,
    private bossProviderService:BossProviderService,
    private playerProviderService:PlayerProviderService
  ) { 'ngInject'; }

  ngOnInit () {
    this.playerProviderService.setPlayer("Lea", 20000, 15500);
    this.raidProviderService.generateRaid();
    this.raidDmgService.doBossPattern(this.bossProviderService.getBoss());
    this.isLoadingSpell = false;
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

  leftClickOnHero(evt, heroId){ //evt.altKey // evt.ctrlKey
    let hero = this.raidDmgService._getRaid()[heroId];
    // Loader then Heal and hide loader
    this.isLoadingSpell = true;
    this.moveProgressBar(600).then(() => {this._changeHeroHealth(hero,-5000), this.isLoadingSpell = false});
  }

  rightClickOnHero(evt, heroId){
    this.raidDmgService.lifebloom(heroId);
  }

  getPlayer(){
    return this.playerProviderService.getPlayer();
  }

  // Use to animate progressBar
  moveProgressBar(milliseconds:number) {
     return new Promise(function (resolve, reject) {
      var elem = document.getElementById("progressBar");   
      var width = 10;
      var id = setInterval(frame, milliseconds/100);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
        } else {
          width++; 
          elem.style.width = width + '%'; 
          //elem.innerHTML = width * 1  + '%';
        }
      }
      setTimeout(resolve, milliseconds); // (A)
     });
  }
  
  // promise delay if animated progress bar
  delay(ms) {
      return new Promise(function (resolve, reject) {
          setTimeout(resolve, ms); // (A)
      });
  }

}
