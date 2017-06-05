import { Injectable } from '@angular/core';
import {Player} from './../models/player';

@Injectable()
export class PlayerProviderService {

  private player:Player;

  constructor() { }

  setPlayer(name:string, baseHealth:number, baseMana:number){
    this.player = new Player(name, baseHealth, baseMana);
  }

  getPlayer(){
    return this.player;
  }

  updateMana(mana){
    this.getPlayer().updateMana(mana);
  }

}
