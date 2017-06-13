import { Injectable } from '@angular/core';
import {RaidProviderService} from './raid-provider.service';
import {PlayerProviderService} from './player-provider.service';
import {BossProviderService} from './boss-provider.service';
import {SpellProviderService} from './spell-provider.service';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import {Boss} from '../models/characters/boss';
import {Hero} from '../models/characters/hero';
	
import * as moment from 'moment/moment';

// Only for dmg or heal 
// move logic separatly


@Injectable()
export class RaidDmgService {

private healJson;

constructor (
    private raidProviderService:RaidProviderService,
    private playerProviderService:PlayerProviderService,
    private bossProviderService:BossProviderService,
    private spellProviderService:SpellProviderService
  ) { 
    'ngInject';
    this.healJson = this.spellProviderService.getHeals();
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
  // Heals
  // =======================

  rejuvenation(hero:Hero){
    let currentHeal = this.spellProviderService.getHealById("0001");
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(currentHeal.cost) && !this.spellProviderService.isHealOnCooldown("0001", moment().clone())){
      this.spellProviderService.tryAddSpellOnHero(hero, "0001", moment());
      this.changeHeroHealthOnTime(hero, -500, 1000, 5); // thenable
      this.playerProviderService.updateBothManaAndBar(currentHeal.cost);
    }
  }

  healingTouch(hero:Hero){
    let currentHeal = this.spellProviderService.getHealById("0002");
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(currentHeal.cost)){
      // heal
      this.changeHeroHealth(hero, currentHeal.amount);
      // pay cost
      this.playerProviderService.updateBothManaAndBar(currentHeal.cost);
    }
  }

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
          // Main attack
          let tankIfAliveOrElseHero = this.raidProviderService.getTankIfAliveOrElseHero();
          if (tankIfAliveOrElseHero != null){
            this.bossProviderService.getBoss().setFocus(tankIfAliveOrElseHero);
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

}
