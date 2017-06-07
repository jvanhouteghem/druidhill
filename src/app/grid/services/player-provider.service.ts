import { Injectable } from '@angular/core';
import {Player} from './../models/characters/player';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";

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

  startPlayerManaRegen(){
    // Interval
    let subscription: Subscription;
    let timer = Observable.timer(0,1000);
    let count = 0;
    subscription = timer.subscribe(t=> {
      this.updateMana(this.getPlayer().getRegenManaPerSecond());
      this.updateManaBar(this.getPlayer().getCurrentManaInPercent());
    });
  }

  updateBothManaAndBar(mana){
    this.updateMana(mana);
    this.updateManaBar(this.getPlayer().getCurrentManaInPercent());
  }

  updateMana(mana){
    this.getPlayer().updateMana(mana);
  }

  updateManaBar(manaInPercent){
    var elem = document.getElementById("manaBar");
    elem.style.width = manaInPercent + '%';
  }

  updateHealthBar(healthInPercent){
    var elem = document.getElementById("healthBar");
    elem.style.width = healthInPercent + '%';
  }

}
