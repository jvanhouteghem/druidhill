import { Injectable } from '@angular/core';
import {RaidProviderService} from './raid-provider.service';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import {Boss} from '../models/boss';
import {Player} from '../models/player';

@Injectable()
export class RaidDmgService {

constructor (
    private raidProviderService:RaidProviderService,
  ) { 
    'ngInject'; 
  }


  _getRaid(){
    return this.raidProviderService.getRaid();
  }

  // =======================
  // Generic effects
  // =======================

  // If inputValue > 0 then its a damage, if inputValue < 0 then its a heal
  changePlayerHealth(inputPlayer, inputValue:number){
    //if (inputPlayer != null){
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
    //}
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

  isHealingPossible(inputPlayer: Player){
    // Cannot receive heal if full
    if (inputPlayer.isDead()){
      return false;
    } else {
      return true;
    }
  }

  isDmgPossible(inputPlayer: Player){
    // Cannot receive anymore damage if dead
    if (inputPlayer.isDead()){
      return false;
    } else {
      return true;
    }
  }

  isFullLife(inputPlayer: Player){
    if ((inputPlayer.getCurrentHealth() == inputPlayer.getBaseHealth())){
      return true;
    } else {
      return false;
    }
  }

  isHealExceedBaseHealth(player: Player, inputValue){
    if (inputValue > player.getDmgTaken()){
      return true;
    } else {
      return false;
    }
  }

  isLethalDmg(player: Player, inputValue){
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
      // Interval
      let subscription: Subscription;
      let timer = Observable.timer(1000,1000);
      let count = 0;
      subscription = timer.subscribe(t=> {
          count++;
          if (count >= 5){
            subscription.unsubscribe();
            player.buff.setLifeBloom(false);
          }
      });
      
    }
  }

  // =======================
  // Negative Spells
  // =======================


  // =======================
  // Boss attacks
  // =======================

  doBossPattern(boss:Boss){
    // Interval
    let subscription: Subscription;
    let timer = Observable.timer(1000,1000);
    let seconds = 0;
    subscription = timer.subscribe(t=> {      
        // If boss is dead then stop
        if (boss.isDead() || this.raidProviderService.isWipe()){
          subscription.unsubscribe();
        } else {
          //console.log(seconds);

          // Main attack
          let tankPlayer = this.raidProviderService.getTankIfAliveOrElsePlayer();
          if (tankPlayer != null){
            this.setFocus(tankPlayer);
            this.changePlayerHealth(tankPlayer, 5000);
          }

          // Secondary attack (every n seconds) // attackonly alive person
          let randomPlayer = this.raidProviderService.getRandomAlivePlayer();
          if (randomPlayer != null){
            this.changePlayerHealth(randomPlayer, 2000); // Ne pas appeller directement le service
          }

          // Thrid attack (every n seconds)
          randomPlayer = this.raidProviderService.getRandomAlivePlayer();
          if (randomPlayer != null){
            this.changePlayerHealth(randomPlayer, 500); // Ne pas appeller directement le service
          }
        }
        seconds++;
    });
  }

  // Only one focus by time
  setFocus(player:Player){
    this.resetBossFocus();
    player.setIsFocusByBoss(true);
  }

  // reset focus
  resetBossFocus(){
    for (let i = 0 ; i < this._getRaid().length ; i++){
      this._getRaid()[i].setIsFocusByBoss(false);
    }
  }

}
