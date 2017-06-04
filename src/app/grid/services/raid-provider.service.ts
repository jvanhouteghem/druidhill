import { Injectable } from '@angular/core';
import {Player} from '../models/player';

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

private raid:Player[] = [];
  private countPlayer: number;

  constructor () { 
    'ngInject';
    this.countPlayer = -1; 
  }

  // Incremental for each player
  generatePlayerId(){
    this.countPlayer++;
    return this.countPlayer;
  }

  generateRaid(){
    this.raid.push(new Player(this.generatePlayerId(), 'Max', 15000, CLASSCOLORS.hunt));
    this.raid.push(new Player(this.generatePlayerId(), 'Lea', 22000, CLASSCOLORS.rogue));
    this.raid.push(new Player(this.generatePlayerId(), 'Ark', 30000, CLASSCOLORS.war, true));
    this.raid.push(new Player(this.generatePlayerId(), 'Niz', 10000, CLASSCOLORS.pal));
    this.raid.push(new Player(this.generatePlayerId(), 'Lupo', 10000, CLASSCOLORS.priest));
    this.raid.push(new Player(this.generatePlayerId(), 'Cam', 10000, CLASSCOLORS.hunt));
    this.raid.push(new Player(this.generatePlayerId(), 'Shak', 10000, CLASSCOLORS.rogue));
    this.raid.push(new Player(this.generatePlayerId(), 'Meg', 10000, CLASSCOLORS.druid));
    this.raid.push(new Player(this.generatePlayerId(), 'Pop', 10000, CLASSCOLORS.rogue));
    this.raid.push(new Player(this.generatePlayerId(), 'Cor', 10000, CLASSCOLORS.hunt));
    // 10 - 15
    this.raid.push(new Player(this.generatePlayerId(), 'Lot', 10000, CLASSCOLORS.pal));
    this.raid.push(new Player(this.generatePlayerId(), 'Vim', 10000, CLASSCOLORS.wizard));
    this.raid.push(new Player(this.generatePlayerId(), 'Luf', 10000, CLASSCOLORS.war));
    this.raid.push(new Player(this.generatePlayerId(), 'Gop', 10000, CLASSCOLORS.druid));
    this.raid.push(new Player(this.generatePlayerId(), 'Tor', 10000, CLASSCOLORS.priest));
    // 15 -20
    this.raid.push(new Player(this.generatePlayerId(), 'Nim', 10000, CLASSCOLORS.wizard));
    this.raid.push(new Player(this.generatePlayerId(), 'Lou', 10000, CLASSCOLORS.hunt));
    this.raid.push(new Player(this.generatePlayerId(), 'Rag', 10000, CLASSCOLORS.rogue));
    this.raid.push(new Player(this.generatePlayerId(), 'Pur', 10000, CLASSCOLORS.hunt));
    this.raid.push(new Player(this.generatePlayerId(), 'Naz', 10000, CLASSCOLORS.pal));
    
    // Add default dmg
    this.raid[0].setDmgTaken(2000);
    this.raid[2].setDmgTaken(3000);
    this.raid[5].setDmgTaken(1000);
    this.raid[7].setDmgTaken(5000);
    this.raid[9].setDmgTaken(7000);

    //this.doWipe();
    return true;
  }

  getRaid():Player[]{
    return this.raid;
  }

  getRandomAlivePlayer(){
    let randomAlivePlayerResult = null;
    let raidLength = this.getRaid().length;
    for (let i = 0 ; i < raidLength && randomAlivePlayerResult === null ; i++){
      let currentPlayer = this.getRaid()[Math.floor((Math.random() * raidLength))];
      if (currentPlayer.getCurrentHealth() > 0){
        randomAlivePlayerResult = currentPlayer;
      }
    }
    return randomAlivePlayerResult;
    //return randomAlivePlayerResult !== null ? randomAlivePlayerResult : (function(){throw "getRandomAlivePlayer : player is null"}());
  }

  isWipe(){
    let result = true;
    for (let i = 0 ; i < this.getRaid().length ; i++){
      if(!this.raid[i].isDead()){
        result = false;
        break;
      }
    }
    return result;
  }

  doWipe(){
    for (let i = 0 ; i < this.getRaid().length ; i++){
      this.raid[i].kill();
    }
  }

  /*doDmg(){
    console.log(this.raid);
    this.raid[0].setDmgTaken(14000);
  }*/

}
