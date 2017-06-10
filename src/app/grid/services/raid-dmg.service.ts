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


// id
// name
// cost : mana cost (must be negative)
// amount : the amount of heal
// nbStack : max number of similar heal at the same time on the target
// initialDelay : start after the initialDelay
// period : the heal occurs every x seconds
// duration : the duration of the heal
// castingTime : delay heal
private healJson = {
  healList: [
    {
      id: "0001",
      name: "Lifebloom",
      cost: -1000,
      amount: -500,
      nbStack: 1,
      time: {
        initialDelay: 1000,
        castingTime: 0,
        period: 1000,
        duration: 8000
      },
      target: "single"
    },
    {
      id: "0002",
      name: "HealingTouch",
      cost: -3000,
      amount: -5000,
      time: {
        initialDelay: 0,
        castingTime: 5000,
        period: 0,
        duration: 0
      },
      target: "single"
    }
  ]
}

constructor (
    private raidProviderService:RaidProviderService,
    private playerProviderService:PlayerProviderService
  ) { 
    'ngInject';
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

  changeHeroHealthOnTime(hero, inputValue, milliSecondByTick=1000, nbTick=5) {
    let focus = this;
     return new Promise(function (resolve, reject) {
      let subscription: Subscription;
          let timer = Observable.timer(1000,milliSecondByTick);
          let count = 0;
          subscription = timer.subscribe(t=> {
              count++;
              focus.changeHeroHealth(hero,inputValue);
              if (count >= nbTick){
                subscription.unsubscribe();
                resolve(true);
              }
         });
     });
  }

  // =======================
  // Filters
  // =======================

  isHeal(inputValue){
    return inputValue < 0 ? true : false;
  }

  // =======================
  // NEW HEAL
  // =======================

  /*getHealById(healId){
    for (let i = 0 ; i < this.healJson.healList.length ; i++){
      if (this.healJson.healList[i].id === healId){
        return this.healJson.healList[i];
      } else {
        throw "No heal for id : " + healId; 
      }
    }
  }*/

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

  // todo fix border if delay between two lb
  // todo heal eclosion
  lifebloom(hero:Hero){
    let cost = -1000;
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(cost)){
      hero.buff.toggleLifeBloom(true);
      this.changeHeroHealthOnTime(hero, -500, 1000, 5).then(res => res === true ? hero.buff.toggleLifeBloom(false) : "");
      this.playerProviderService.updateBothManaAndBar(cost);
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
    for (let i = 0 ; i < this.raidProviderService.getRaid().length ; i++){
      this.raidProviderService.getRaid()[i].setIsFocusByBoss(false);
    }
  }

}
