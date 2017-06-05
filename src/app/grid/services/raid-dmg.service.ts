import { Injectable } from '@angular/core';
import {RaidProviderService} from './raid-provider.service';
import {PlayerProviderService} from './player-provider.service';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import {Boss} from '../models/boss';
import {Hero} from '../models/hero';

@Injectable()
export class RaidDmgService {

constructor (
    private raidProviderService:RaidProviderService,
    private playerProviderService:PlayerProviderService
  ) { 
    'ngInject'; 
  }


  _getRaid(){
    return this.raidProviderService.getRaid();
  }

  // =======================
  // Generic effects
  // =======================

  // update player info if target is player
  updateIfPlayer(inputHero:Hero){
    if(inputHero.getIsPlayer()){
      this.playerProviderService.getPlayer().setDmgTaken(inputHero.getDmgTaken());
    }
  }

  // If inputValue > 0 then its a damage, if inputValue < 0 then its a heal
  changeHeroHealth(inputHero, inputValue:number){
    //if (inputHero != null){
      // Damage
      if (!this.isHeal(inputValue) && this.isDmgPossible(inputHero)){
        inputHero.setDmgTaken(inputHero.getDmgTaken() + inputValue);
        // Lethal
        if (this.isLethalDmg(inputHero, inputValue)){
          inputHero.kill();
        }
      }
      // Heal
      else if (this.isHeal(inputValue) && this.isHealingPossible(inputHero) && !this.isFullLife(inputHero)){
        // Receive part of heal (if current life + heal > baseHealth then set currentHealth to baseHealth)
        if (this.isHealExceedBaseHealth(inputHero, inputValue)){
          inputHero.setDmgTaken(0);
        } 
        // Else receive full heal
        else {
          inputHero.setDmgTaken(inputHero.getDmgTaken() + inputValue);
        }
      }
    //}
      this.updateIfPlayer(inputHero);
  }

  changeHeroHealthOnTime(hero, inputValue, milliSecondByTick=1000, nbTick=5){
    // Interval
    let subscription: Subscription;
    let timer = Observable.timer(1000,milliSecondByTick);
    let count = 0;
    subscription = timer.subscribe(t=> {
        count++;
        this.changeHeroHealth(hero,inputValue);
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

  isEnoughMana(manaCost:number){
    return this.playerProviderService.getPlayer().getCurrentMana() >= Math.abs(manaCost) ? true : false;
  }

  isHealingPossible(inputHero: Hero/*, manaCost:number*/){
    // Cannot receive heal if full or if not enough mana
    if (inputHero.isDead()){
      return false;
    } else {
      return true;
    }
  }

  isDmgPossible(inputHero: Hero){
    // Cannot receive anymore damage if dead
    if (inputHero.isDead()){
      return false;
    } else {
      return true;
    }
  }

  isFullLife(inputHero: Hero){
    if ((inputHero.getCurrentHealth() == inputHero.getBaseHealth())){
      return true;
    } else {
      return false;
    }
  }

  isHealExceedBaseHealth(hero: Hero, inputValue){
    if (inputValue > hero.getDmgTaken()){
      return true;
    } else {
      return false;
    }
  }

  isLethalDmg(hero: Hero, inputValue){
    if (hero.getCurrentHealth() - inputValue <= 0){
      return true;
    } else {
      return false;
    }
  }

  // =======================
  // Positive Spells
  // =======================

  lifebloom(heroId){

    let hero = this._getRaid()[heroId];
    let cost = -1000;

    if (this.isHealingPossible(hero) && this.isEnoughMana(cost)){
      hero.buff.setLifeBloom(true);
      this.changeHeroHealthOnTime(hero, -500, 1000, 5);
      // Interval
      let subscription: Subscription;
      let timer = Observable.timer(1000,1000);
      let count = 0;
      subscription = timer.subscribe(t=> {
          count++;
          if (count >= 5){
            subscription.unsubscribe();
            hero.buff.setLifeBloom(false);
          }
      });
      // pay cost
      this.playerProviderService.updateMana(cost); // todo config file for spells cost
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
          let tankIfAliveOrElseHero = this.raidProviderService.getTankIfAliveOrElseHero();
          if (tankIfAliveOrElseHero != null){
            this.setFocus(tankIfAliveOrElseHero);
            this.changeHeroHealth(tankIfAliveOrElseHero, 2000);
          }

          // Secondary attack (every n seconds) // attackonly alive person
          let randomHero = this.raidProviderService.getRandomAliveHero();
          if (randomHero != null){
            this.changeHeroHealth(randomHero, 1000);
          }

          // Thrid attack (every n seconds)
          randomHero = this.raidProviderService.getRandomAliveHero();
          if (randomHero != null){
            this.changeHeroHealth(randomHero, 500);
          }
        }
        seconds++;
    });
  }

  // Only one focus by time
  setFocus(hero:Hero){
    hero.setIsFocusByBoss(true);
    hero.setTankValue(true); // If tank is dead then the next target become the tank even if she is weak
  }

  // reset focus
  resetBossFocus(){
    for (let i = 0 ; i < this._getRaid().length ; i++){
      this._getRaid()[i].setIsFocusByBoss(false);
    }
  }

}
