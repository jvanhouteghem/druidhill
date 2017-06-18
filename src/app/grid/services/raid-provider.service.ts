import { Injectable } from '@angular/core';
import {Hero} from '../models/characters/hero';
import {PlayerProviderService} from './player-provider.service';

export const CLASSCOLORS = {
  hunt: "#839b55",
  rogue: "#8b8241",
  war: "#745a3c",
  pal: "#a6687d",
  druid: "#b45604",
  wizard: "#36708a",
  priest: "#959495"
};

@Injectable()
export class RaidProviderService {

private raid:Hero[] = [];
  private countHero: number;

  constructor (private playerProviderService:PlayerProviderService) { 
    'ngInject';
    this.countHero = -1; 
  }

  // Incremental for each hero
  generateHeroId(){
    this.countHero++;
    return this.countHero;
  }

  _getPlayer(){
    return this.playerProviderService.getPlayer();
  }

  generateRaid(){
    this.raid.push(new Hero(this.generateHeroId(), this._getPlayer().getName(), this._getPlayer().getCurrentHealth(), CLASSCOLORS.druid, false, true));
    this.raid.push(new Hero(this.generateHeroId(), 'Max', 15000, CLASSCOLORS.hunt));
    this.raid.push(new Hero(this.generateHeroId(), 'Ark', 30000, CLASSCOLORS.war, true));
    this.raid.push(new Hero(this.generateHeroId(), 'Niz', 12000, CLASSCOLORS.pal));
    this.raid.push(new Hero(this.generateHeroId(), 'Lupo', 12000, CLASSCOLORS.priest));
    this.raid.push(new Hero(this.generateHeroId(), 'Cam', 12000, CLASSCOLORS.hunt));
    this.raid.push(new Hero(this.generateHeroId(), 'Shak', 12000, CLASSCOLORS.rogue));
    this.raid.push(new Hero(this.generateHeroId(), 'Meg', 12000, CLASSCOLORS.druid));
    this.raid.push(new Hero(this.generateHeroId(), 'Pop', 12000, CLASSCOLORS.rogue));
    this.raid.push(new Hero(this.generateHeroId(), 'Cor', 12000, CLASSCOLORS.hunt));
    // 10 - 15
    this.raid.push(new Hero(this.generateHeroId(), 'Lot', 12000, CLASSCOLORS.pal));
    this.raid.push(new Hero(this.generateHeroId(), 'Vim', 12000, CLASSCOLORS.wizard));
    this.raid.push(new Hero(this.generateHeroId(), 'Luf', 12000, CLASSCOLORS.war));
    this.raid.push(new Hero(this.generateHeroId(), 'Gop', 12000, CLASSCOLORS.druid));
    this.raid.push(new Hero(this.generateHeroId(), 'Tor', 12000, CLASSCOLORS.priest));
    // 15 -20
    this.raid.push(new Hero(this.generateHeroId(), 'Nim', 12000, CLASSCOLORS.wizard));
    this.raid.push(new Hero(this.generateHeroId(), 'Lou', 12000, CLASSCOLORS.hunt));
    this.raid.push(new Hero(this.generateHeroId(), 'Rag', 12000, CLASSCOLORS.rogue));
    this.raid.push(new Hero(this.generateHeroId(), 'Pur', 12000, CLASSCOLORS.hunt));
    this.raid.push(new Hero(this.generateHeroId(), 'Naz', 12000, CLASSCOLORS.pal));
    
    // Add default dmg
    //this.raid[0].setDmgTaken(2000);
    /*this.raid[2].setDmgTaken(3000);
    this.raid[5].setDmgTaken(1000);
    this.raid[7].setDmgTaken(5000);
    this.raid[9].setDmgTaken(7000);*/

    //this.doWipe();
    return true;
  }

  getRaid():Hero[]{
    return this.raid;
  }

  getRandomAliveHero(){
    let randomAliveHeroResult = null;
    let raidLength = this.getRaid().length;
    for (let i = 0 ; i < raidLength && randomAliveHeroResult === null ; i++){
      let currentHero = this.getRaid()[Math.floor((Math.random() * raidLength))];
      if (currentHero.getCurrentHealth() > 0){
        randomAliveHeroResult = currentHero;
      }
    }
    return randomAliveHeroResult;
  }

  getNbHeroAlive(){
    let result = 0;
    for (let i = 0 ; i < this.getRaid().length ; i++){
      if(!this.raid[i].isDead()){
        result ++;
      }
    }
    return result;  
  }

  isWipe(){
    return this.getNbHeroAlive() > 0 ? false : true;
  }

  doWipe(){
    for (let i = 0 ; i < this.getRaid().length ; i++){
      this.raid[i].kill();
      this.playerProviderService.getPlayer().kill();
    }
  }

  getTankIfAliveOrElseHero(){
    // if tank is alive
    for (let i = 0 ; i < this.getRaid().length ; i++){
      if(!this.raid[i].isDead() && this.raid[i].getTankValue()){
        return this.raid[i];
      }
    } 
    // else
    return this.getRandomAliveHero();
  }

  // retourne un array d'héro sélectionnés
  getRaidFilter(heroId:number){
    let resultHeroList = [];

    // The hero clicked
    resultHeroList.push(this.getRaid()[heroId]);

    // Left hero
    let isHeroMinus1Exists = heroId - 1 >= 0;
    let isHeroMinus1OnTheSameLine = heroId % 5;  // if heroId % 5 = 0 we are on the left border => then we don't heal left
    if (isHeroMinus1Exists && isHeroMinus1OnTheSameLine) {
      resultHeroList.push(this.getRaid()[heroId - 1]);
    }

    // Right Hero
    let isHeroPlus1Exists = heroId + 1 <= 20;
    let isHeroPlus1OnTheSameLine = (heroId + 1) % 5 != 0; // if (heroId + 1) % 5 = 0 we are on the right border => then we don't heal right
    if (isHeroPlus1Exists && isHeroPlus1OnTheSameLine) {
      resultHeroList.push(this.getRaid()[heroId + 1]);
    }

    return resultHeroList;

  }

}
