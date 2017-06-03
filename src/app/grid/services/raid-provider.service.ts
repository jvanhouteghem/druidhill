import { Injectable } from '@angular/core';
import {Player} from '../models/player';

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
    this.raid.push(new Player(this.generatePlayerId(), 'Max', 15000));
    this.raid.push(new Player(this.generatePlayerId(), 'Lea', 22000));
    this.raid.push(new Player(this.generatePlayerId(), 'Ark', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Niz', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Lupo', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Cam', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Shak', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Meg', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Pop', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Cor', 10000));
    // 10 - 15
    this.raid.push(new Player(this.generatePlayerId(), 'Cam', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Shak', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Meg', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Pop', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Cor', 10000));
    // 15 -20
    this.raid.push(new Player(this.generatePlayerId(), 'Cam', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Shak', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Meg', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Pop', 10000));
    this.raid.push(new Player(this.generatePlayerId(), 'Cor', 10000));
    
    // Add default dmg
    this.raid[0].setDmgTaken(2000);
    this.raid[2].setDmgTaken(3000);
    this.raid[5].setDmgTaken(1000);
    this.raid[7].setDmgTaken(5000);
    this.raid[9].setDmgTaken(7000);

    // fail
    //var t=setInterval(this.doDmg,1000);
    return true;
  }

  getRaid():Player[]{
    return this.raid;
  }

  /*doDmg(){
    console.log(this.raid);
    this.raid[0].setDmgTaken(14000);
  }*/

}
