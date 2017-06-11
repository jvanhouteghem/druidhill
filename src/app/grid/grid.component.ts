import { Component, OnInit } from '@angular/core';
import {RaidProviderService} from './services/raid-provider.service';
import {RaidDmgService} from './services/raid-dmg.service';
import {BossProviderService} from './services/boss-provider.service';
import {PlayerProviderService} from './services/player-provider.service';
import {SpellProviderService} from './services/spell-provider.service';
import {GameProviderService} from './services/game-provider.service';
import {Hero} from './models/characters/hero';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

//http://localhost:4200/assets/img/0001.jpg
@Input() imgPath:string = "app/assets/img";
imgFileName:string = "001.jpg";

    

// Only for event and display
  constructor (
    private raidProviderService:RaidProviderService,
    private raidDmgService: RaidDmgService,
    private bossProviderService:BossProviderService,
    private playerProviderService:PlayerProviderService,
    private spellProviderService:SpellProviderService,
    private gameProviderService:GameProviderService
  ) { 'ngInject'; }

  ngOnInit () {
    this.gameProviderService.startGame();
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
    this.raidDmgService.rejuvenation(hero);
  }

  rightClickOnHero(evt, heroId){
    let hero = this.raidProviderService.getRaid()[heroId];
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(-5000)){
      this.spellProviderService.setIsLoadingSpell(true);
      this.moveProgressBar(600).then(() => {this.raidDmgService.healingTouch(hero), this.spellProviderService.setIsLoadingSpell(false)});
    }
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

  // promise delay if animated progress bar
  delay(ms) {
      return new Promise(function (resolve, reject) {
          setTimeout(resolve, ms); // (A)
      });
  }


  /*_isSpellActiveOnHero(heroId, healId:string){
    let hero = this.raidProviderService.getRaid()[heroId];
    return this.spellProviderService.isSpellActiveOnHero(hero, healId);
  }*/

}
