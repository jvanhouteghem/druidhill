import { Injectable } from '@angular/core';
import {RaidProviderService} from './raid-provider.service';

import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";

@Injectable()
export class RaidDmgService {

constructor (
    private raidProviderService:RaidProviderService,
  ) { 'ngInject'; }

  _getRaid(){
    return this.raidProviderService.getRaid();
  }

  // =======================
  // Generic effects
  // =======================

  // If inputValue > 0 then its a damage, if inputValue < 0 then its a heal
  changePlayerHealth(inputPlayer, inputValue:number){
    // Damage
    if (!this.isHeal(inputValue) && this.isDmgPossible(inputPlayer)){
      inputPlayer.setDmgTaken(inputPlayer.getDmgTaken() + inputValue);
      // Lethal
      if (this.isLethalDmg(inputPlayer, inputValue)){
        inputPlayer.kill();
      }
    }
    // Heal
    else if (this.isHeal(inputValue) && this.isHealingPossible(inputPlayer) && !this.isFullLife(inputPlayer)){
      // Receive part of heal (if current life + heal > baseHealth then set currentHealth to baseHealth)
      if (this.isHealExceedBaseHealth(inputPlayer, inputValue)){
        inputPlayer.setDmgTaken(0);
      } 
      // Else receive full heal
      else {
        inputPlayer.setDmgTaken(inputPlayer.getDmgTaken() + inputValue);
      }
    }
  }

  changePlayerHealthOnTime(player, inputValue, milliSecondByTick=1000, nbTick=5){
    // Interval
    let subscription: Subscription;
    let timer = Observable.timer(1000,milliSecondByTick);
    let count = 0;
    subscription = timer.subscribe(t=> {
        count++;
        this.changePlayerHealth(player,inputValue);
        if (count >= nbTick){
          subscription.unsubscribe();
        }
    });
    //
    /*this.$interval(()=> { // use $interval instead of setInterval to refresh view
        this.changePlayerHealth(player, inputValue)
    }, milliSecondByTick, nbTick);
    return Promise.resolve();*/
  }

  // =======================
  // Filters
  // =======================

  isHeal(inputValue){
    // Todo throw if null
    if (inputValue < 0){
      return true;
    } else {
      return false;
    }
  } 

  isHealingPossible(inputPlayer){
    // Cannot receive heal if full
    if (this.isDead(inputPlayer)){
      return false;
    } else {
      return true;
    }
  }

  isDmgPossible(inputPlayer){
    // Cannot receive anymore damage if dead
    if (this.isDead(inputPlayer)){
      return false;
    } else {
      return true;
    }
  }

  isFullLife(inputPlayer){
    if ((inputPlayer.getCurrentHealth() == inputPlayer.getBaseHealth())){
      return true;
    } else {
      return false;
    }
  }

  isDead(inputPlayer){
    if ((inputPlayer.getCurrentHealth() == 0) || inputPlayer.isDead){
      return true;
    } else {
      return false;
    }
  }

  isHealExceedBaseHealth(player, inputValue){
    if (inputValue > player.getDmgTaken()){
      return true;
    } else {
      return false;
    }
  }

  isLethalDmg(player, inputValue){
    if (player.getCurrentHealth() - inputValue <= 0){
      return true;
    } else {
      return false;
    }
  }

  // =======================
  // Positive Spells
  // =======================

  lifebloom(playerId){

    let player = this._getRaid()[playerId];

    if (this.isHealingPossible(player)){
      player.buff.setLifeBloom(true);
      this.changePlayerHealthOnTime(player, -500, 1000, 5);
      /*this.$timeout(()=> { 
          player.buff.setLifeBloom(false);
      }, 1000*5);*/
      
    }
  }

  // =======================
  // Negative Spells
  // =======================

}
