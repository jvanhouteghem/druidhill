import { Component, OnInit } from '@angular/core';
import {RaidProviderService} from './services/raid-provider.service';
import {RaidDmgService} from './services/raid-dmg.service';
import {BossProviderService} from './services/boss-provider.service';
import {PlayerProviderService} from './services/player-provider.service';
import {Hero} from './models/characters/hero';
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
    this.playerProviderService.startPlayerManaRegen();

    this.initializeHealthBar();
    this.initializeManaBar();
  }

  _getRaid(){
    return this.raidProviderService.getRaid();
  }

  getCSSGradient(heroId:number){
    let hero = this.raidProviderService.getRaid()[heroId];
    return "linear-gradient(0deg, " + hero.getClassColor() + " " + this._getHeroHealthInPercent(hero.getId()) + "%, #4a4a4a 0%)"; // Warning, don't add ";" in string // life / background
  }

  _changeHeroHealth(hero: Hero,inputNb: number){
    this.raidDmgService.changeHeroHealth(hero, inputNb);
  }

  _getHeroHealthInPercent(heroId:number){
    return this.raidProviderService.getRaid()[heroId].getCurrentHealthInPercent();
  }

  leftClickOnHero(evt, heroId){ //evt.altKey // evt.ctrlKey
    let hero = this.raidProviderService.getRaid()[heroId];
    // Loader then Heal and hide loader
    // todo refacto
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(-5000)){
      this.isLoadingSpell = true;
      this.moveProgressBar(600).then(() => {this.raidDmgService.healingTouch(hero), this.isLoadingSpell = false});
    }
  }

  rightClickOnHero(evt, heroId){
    let hero = this.raidProviderService.getRaid()[heroId];
    this.raidDmgService.lifebloom(hero);
  }

  getPlayer(){
    return this.playerProviderService.getPlayer();
  }

  // Use to animate progressBar
  // todo move away
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
      setTimeout(resolve, milliseconds); 
     });
  }

  initializeHealthBar(){
    var elem = document.getElementById("healthBar");
    elem.style.width = '100%';
  }

  initializeManaBar(){
    var elem = document.getElementById("manaBar");
    elem.style.width = '100%';
  }

  // promise delay if animated progress bar
  delay(ms) {
      return new Promise(function (resolve, reject) {
          setTimeout(resolve, ms); // (A)
      });
  }

}
