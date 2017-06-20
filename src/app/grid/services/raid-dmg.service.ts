import { Injectable } from '@angular/core';
import { RaidProviderService } from './raid-provider.service';
import { PlayerProviderService } from './player-provider.service';
import { SpellProviderService } from './spell-provider.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import { Boss } from '../models/characters/boss';
import { Hero } from '../models/characters/hero';
import { Player } from '../models/characters/player';

import * as moment from 'moment/moment';
import { GameProviderService } from './game-provider.service';
import * as Rx from "rxjs/Rx";

@Injectable()
export class RaidDmgService {

  private healJson;

  private changeHealthSubscription;
  private changeManaSubscription;
  private playerCastingSubscription;

  constructor(
    private raidProviderService: RaidProviderService,
    private playerProviderService: PlayerProviderService,
    private spellProviderService: SpellProviderService,
  ) {
    'ngInject';
    this.healJson = this.spellProviderService.getHeals();
  }

  // =======================
  // Generic effects
  // =======================

  // update player info if target is player
  updateIfPlayer(hero: Hero) {
    if (hero.getIsPlayer()) {
      this.playerProviderService.getPlayer().setDmgTaken(hero.getDmgTaken());
      this.playerProviderService.updateHealthBar(hero.getCurrentHealthInPercent());
    }
  }

  // If inputValue > 0 then its a damage, if inputValue < 0 then its a heal
  changeHeroHealth(hero, inputValue: number) {
    //if (inputHero != null){
    // Damage
    if (!this.isHeal(inputValue) && hero.isDmgPossible(hero)) {
      hero.setDmgTaken(hero.getDmgTaken() + inputValue);
      // Lethal
      if (hero.isLethalDmg(hero, inputValue)) {
        hero.kill();
      }
    }
    // Heal
    else if (this.isHeal(inputValue) && hero.isHealingPossible(hero) && !hero.isFullLife(hero)) {
      // Receive part of heal (if current life + heal > baseHealth then set currentHealth to baseHealth)
      if (hero.isHealExceedBaseHealth(inputValue)) {
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

  changeHeroHealthOnTime(hero, inputValue, milliSecondByTick = 1000, nbTick = 1) {
    // Observable emits
    var source = Rx.Observable
      .interval(milliSecondByTick)
      //.timeInterval()
      .take(nbTick); // call complete() after nbTick is done

    // Observer receive
    var observer = {
      next: x => this.changeHeroHealth(hero, inputValue),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification : heal done'),
    };

    this.changeHealthSubscription = source.subscribe(observer);
  }

  changePlayerMana(inputValue: number) {
    let player = this.playerProviderService.getPlayer();
    player.updateMana(inputValue);
  }

  changePlayerManaOnTime(inputValue, milliSecondByTick = 1000, nbTick = 1) {
    // Observable emits
    var source = Rx.Observable
      .interval(milliSecondByTick)
      //.timeInterval()
      .take(nbTick); // call complete() after nbTick is done

    // Observer receive
    var observer = {
      next: x => this.changePlayerMana(inputValue),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification : mana regen done'),
    };

    this.changeManaSubscription = source.subscribe(observer);
  }

  // =======================
  // Filters
  // =======================

  isHeal(inputValue) {
    return inputValue < 0 ? true : false;
  }

  // =======================
  // Heals
  // =======================

  rejuvenation(hero: Hero) {
    let SPELLID = "0001";
    let currentHeal = this.spellProviderService.getHealById(SPELLID);
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(currentHeal.cost) && !this.spellProviderService.isHealOnCooldown(SPELLID, moment().clone())) {
      this.spellProviderService.tryAddSpellOnHero(hero, SPELLID, moment()); // used to calculate cooldown
      this.changeHeroHealthOnTime(hero, currentHeal.amount, currentHeal.time.period, currentHeal.time.duration/currentHeal.time.period);
      this.playerProviderService.updateBothManaAndBar(currentHeal.cost);
    }
  }

  healingTouch(hero: Hero) {
    //this.subscription.unsubscribe();
    let SPELLID = "0002";
    let currentHeal = this.spellProviderService.getHealById(SPELLID);
    if (hero.isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(currentHeal.cost) && !this.spellProviderService.isHealOnCooldown(SPELLID, moment().clone())) {
      this.spellProviderService.tryAddSpellOnHero(hero, SPELLID, moment()); // used to calculate cooldown
      this.spellProviderService.setIsLoadingSpell(true); // used to hide/display progress bar

      let doWhenCastComplete = () => {
        this.spellProviderService.setIsLoadingSpell(false),
          this.changeHeroHealth(hero, currentHeal.amount),
          this.playerProviderService.updateBothManaAndBar(currentHeal.cost)
      };
      this.movePlayerProgressBar(currentHeal.time.initialDelay, doWhenCastComplete);
    }
  }

  wildGrowth(heroId: number) {
    let SPELLID = "0003";
    let heroListToHeal = this.raidProviderService.getRaidFilter(heroId);
    let raidModulo = 5; // 5 = length / heroByLines
    let currentHeal = this.spellProviderService.getHealById(SPELLID);

    if (heroListToHeal.length > 0 && !this.spellProviderService.isHealOnCooldown(SPELLID, moment().clone())) {
      this.playerProviderService.updateBothManaAndBar(currentHeal.cost);
      for (let i = 0; i < heroListToHeal.length; i++) {
        if (heroListToHeal[i].isHealingPossible() && this.playerProviderService.getPlayer().isEnoughMana(currentHeal.cost)) {
          this.spellProviderService.tryAddSpellOnHero(heroListToHeal[i], SPELLID, moment()); // used to calculate cooldown
          this.changeHeroHealthOnTime(heroListToHeal[i], currentHeal.amount, currentHeal.time.period, currentHeal.time.duration/currentHeal.time.period);
        }
      }
    }
  }

  innervate() {
    let SPELLID = "0004";
    let currentSpell = this.spellProviderService.getHealById(SPELLID);
    this.spellProviderService.tryAddSpellOnHero(this.raidProviderService.getRaid()[0], SPELLID, moment()); // used to calculate cooldown
    this.changePlayerManaOnTime(currentSpell.amount, currentSpell.time.period, currentSpell.time.duration/currentSpell.time.period);
  }

  tranquility() {
    let SPELLID = "0005";
    let currentHeal = this.spellProviderService.getHealById(SPELLID);
    let raid = this.raidProviderService.getRaid();
    this.playerProviderService.updateBothManaAndBar(currentHeal.cost);
    for (let i = 0; i < raid.length; i++) {
      this.spellProviderService.tryAddSpellOnHero(raid[i], SPELLID, moment()); // used to calculate cooldown
      this.changeHeroHealthOnTime(raid[i], currentHeal.amount, currentHeal.time.period, currentHeal.time.duration/currentHeal.time.period);
    }
  }

  // =======================
  // Others
  // =======================  

  // todo moove in player-bars
  movePlayerProgressBar(milliseconds: number, doWhenCastComplete: any) {
    // Observable emits
    var source = Rx.Observable
      .interval(milliseconds / 100)
      //.timeInterval()
      .take(100); // call complete() after nbTick is done

    // Observer receive
    var elem = document.getElementById("progressBar");
    var width = 0;
    var observer = {
      next: x => { width++ , elem.style.width = width + '%' },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => { console.log('Observer got a complete notification : player progress bar loaded'), doWhenCastComplete() },
    };

    this.playerCastingSubscription = source.subscribe(observer);
  }

}
