import { Injectable } from '@angular/core';
import {RaidProviderService} from './raid-provider.service';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import {Boss} from '../models/boss';

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
    if (this.isPlayerDead(inputPlayer)){
      return false;
    } else {
      return true;
    }
  }

  isDmgPossible(inputPlayer){
    // Cannot receive anymore damage if dead
    if (inputPlayer != null && this.isPlayerDead(inputPlayer)){
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

  isPlayerDead(inputPlayer){
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
          // get focus (first tank then someone at random)
          let tankPlayer = this._getRaid()[2];
          this.changePlayerHealth(tankPlayer, 500);

          // Secondary attack (every n seconds) // attackonly alive person
          let randomPlayer = this.raidProviderService.getRandomAlivePlayer();
          this.changePlayerHealth(randomPlayer, 2000); // Ne pas appeller directement le service

          // Thrid attack (every n seconds)
          randomPlayer = this.raidProviderService.getRandomAlivePlayer();
          this.changePlayerHealth(randomPlayer, 500); // Ne pas appeller directement le service
        }
        seconds++;
    });
  }

}
