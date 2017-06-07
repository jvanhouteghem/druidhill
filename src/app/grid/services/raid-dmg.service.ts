import { Injectable } from '@angular/core';
import {RaidProviderService} from './raid-provider.service';
import {PlayerProviderService} from './player-provider.service';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import {Boss} from '../models/characters/boss';
import {Hero} from '../models/characters/hero';

// Only for dmg or heal 
// move logic separatly


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
  updateIfPlayer(hero:Hero){
    if(hero.getIsPlayer()){
      this.playerProviderService.getPlayer().setDmgTaken(hero.getDmgTaken());
      this.playerProviderService.updateHealthBar(hero.getCurrentHealthInPercent());
    }
  }

  // If inputValue > 0 then its a damage, if inputValue < 0 then its a heal
  changeHeroHealth(hero, inputValue:number){
    //if (inputHero != null){
      // Damage
      if (!this.isHeal(inputValue) && hero.isDmgPossible(hero)){
        hero.setDmgTaken(hero.getDmgTaken() + inputValue);
        // Lethal
        if (hero.isLethalDmg(hero, inputValue)){
          hero.kill();
        }
      }
      // Heal
      else if (this.isHeal(inputValue) && hero.isHealingPossible(hero) && !hero.isFullLife(hero)){
        // Receive part of heal (if current life + heal > baseHealth then set currentHealth to baseHealth)
        if (hero.isHealExceedBaseHealth(inputValue)){
          hero.setDmgTaken(0);
        } 
        // Else receive full heal
        else {
          hero.setDmgTaken(hero.getDmgTaken() + inputValue);
        }
      }
    //}
      this.updateIfPlayer(hero);
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



  // =======================
  // Positive Spells
  // =======================

  healingTouch(hero:Hero){
    let cost = -5000; // todo config file for spells and cost
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(cost)){
      // heal
      this.changeHeroHealth(hero, -5000);
      // pay cost
      this.playerProviderService.updateMana(cost); // todo config file for spells cost
      this.playerProviderService.updateManaBar(this.playerProviderService.getPlayer().getCurrentManaInPercent());
    }
  }

  lifebloom(hero:Hero){
    let cost = -1000; // todo config file for spells and cost
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(cost)){
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
      this.playerProviderService.updateBothManaAndBar(cost);
      //this.playerProviderService.updateMana(cost); // todo config file for spells cost
      //this.playerProviderService.updateManaBar(this.playerProviderService.getPlayer().getCurrentManaInPercent());
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

  // todo moove 
  // Only one focus by time
  setFocus(hero:Hero){
    hero.setIsFocusByBoss(true);
    hero.setTankValue(true); // If tank is dead then the next target become the tank even if she is weak
  }

  // todo moove 
  // reset focus
  resetBossFocus(){
    for (let i = 0 ; i < this._getRaid().length ; i++){
      this._getRaid()[i].setIsFocusByBoss(false);
    }
  }

}
