import { Injectable } from '@angular/core';
import * as moment from 'moment/moment';
import { Hero } from '../models/characters/hero';
import { RaidProviderService } from './raid-provider.service';

@Injectable()
export class SpellProviderService {


  private globalCooldown = 1000;

  // id : unique, match with .img
  // name
  // cost : mana cost (must be negative)
  // amount : the amount of heal
  // maxStack : max number of similar heal at the same time on the target
  // currentStack : nb of stack at this time
  // initialDelay : start after the initialDelay
  // period : the heal occurs every x seconds
  // duration : the duration of the heal
  // castingTime : delay heal
  // target Type : single; cross, diagonal
  // cooldown
  // lastTimeUsed : date, used to calculate cooldown
  // usedBy : list of every hero who use the spell : {heroId : 01, lastTimeUsed: moment}
  private heals = {
    heals: [
      {
        id: "0001",
        name: "Rejuvenation",
        cost: -1000,
        amount: -500,
        maxStack: 1,
        time: {
          initialDelay: 1000,
          castingTime: 0,
          period: 1000,
          duration: 8000
        },
        targetType: "single",
        cooldown: 5
      },
      {
        id: "0002",
        name: "HealingTouch",
        cost: -3000,
        amount: -5000,
        maxStack: 1,
        time: {
          initialDelay: 0,
          castingTime: 5000,
          period: 0,
          duration: 0
        },
        targetType: "single",
        cooldown: 5
      }
    ]
  }

  private isLoadingSpell: boolean;

  constructor(private raidProviderService: RaidProviderService) {
    this.isLoadingSpell = false;
  }

  setIsLoadingSpell(value){
    this.isLoadingSpell = value;
  }

  getIsLoadingSpell(){
    return this.isLoadingSpell;
  }

  getHeals() {
    return this.heals.heals;
  };

  getHealById(healId) {
    for (let i = 0; i < this.getHeals().length; i++) {
      if (this.getHeals()[i].id === healId) {
        return this.getHeals()[i];
      } else {
        throw "No heal for this id : " + healId;
      }
    }
  }

  // Loop each hero to get last time a spell was used
  getLastTimeSpellUsed(spellId) {
    let result = moment().clone().startOf('day');
    for (let i = 0; i < this.raidProviderService.getRaid().length; i++) {
      let currentHeroSpells = this.raidProviderService.getRaid()[i].getSpellsOnHero();
      for (let j = 0; j < currentHeroSpells.length; j++) {
        if (currentHeroSpells[j].lastTimeUsed.isAfter(result)) {
          result = currentHeroSpells[j].lastTimeUsed;
        }
      }
    }
    return result;
  }

  isHealOnCooldown(spellId, inputMoment) {
    let lastTimeSpellUsed = this.getLastTimeSpellUsed(spellId);
    let compare = !inputMoment.clone().subtract(this.globalCooldown, 'millisecond').isAfter(lastTimeSpellUsed);
    return compare;
  }

  tryAddSpellOnHero(hero: Hero, inputSpellId, inputSpellUsedTime) {
    let isAlready = hero.isSpellInSpellArray(inputSpellId);
    if (!isAlready) {
      hero.addSpell(inputSpellId, inputSpellUsedTime);
    }
    else {
      hero.updateSpell(inputSpellId, inputSpellUsedTime);
    }
  }

}
