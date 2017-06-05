import { Injectable } from '@angular/core';
import {Player} from './../models/player';

@Injectable()
export class PlayerProviderService {

  private player:Player;

  constructor() { }

  setPlayer(name:string, mana:number){
    this.player = new Player(name, mana);
  }

  getPlayer(){
    return this.player;
  }

  updateMana(mana){
    this.getPlayer().updateMana(mana);
  }

}
