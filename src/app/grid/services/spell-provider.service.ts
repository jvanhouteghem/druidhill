import { Injectable } from '@angular/core';
import * as moment from 'moment/moment';
import { Hero } from '../models/characters/hero';
import { RaidProviderService } from './raid-provider.service';

@Injectable()
export class SpellProviderService {


  private globalCooldown:number = 1000;

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
  private heals = [
    {
      id: "0001",
      name: "Rejuvenation",
      cost: -1000,
      amount: -500,
      maxStack: 1,
      //type: "H", // H heal, M mana regen
      time: {
        initialDelay: 1000,
        castingTime: 0,
        period: 1000,
        duration: 8000
      },
      targetType: "single",
      cooldown: 0
    },
    {
      id: "0002",
      name: "HealingTouch",
      cost: -5000,
      amount: -15000,
      maxStack: 1,
      //type: "H",
      time: {
        initialDelay: 0,
        castingTime: 5000,
        period: 0,
        duration: 0
      },
      targetType: "single",
      cooldown: 5000
    }, {
      id: "0003",
      name: "WildGrowth",
      cost: -2000,
      amount: -1000,
      maxStack: 1,
      //type: "H",
      time: {
        initialDelay: 0,
        castingTime: 0,
        period: 1000,
        duration: 5000
      },
      targetType: "single", //[0,-1,+1], // select target (0), previous (-1) and next (+1)
      cooldown: 5000
    }, {
      id: "0004",
      name: "Innervate",
      cost: 0,
      amount: 2000, // positive when win mana
      maxStack: 1,
      //type: "M",
      time: {
        initialDelay: 0,
        castingTime: 0,
        period: 1000,
        duration: 5000
      },
      targetType: "single", //[0,-1,+1], // select target (0), previous (-1) and next (+1)
      cooldown: 5000
    }, {
      id: "0005",
      name: "Tranquility",
      cost: -7000,
      amount: -2000,
      maxStack: 1,
      //type: "H",
      time: {
        initialDelay: 0,
        castingTime: 0,
        period: 1000,
        duration: 5000
      },
      targetType: "all", //[0,-1,+1], // select target (0), previous (-1) and next (+1)
      cooldown: 30000
    }
  ];

  private isLoadingSpell: boolean;

  constructor(private raidProviderService: RaidProviderService) {
    this.isLoadingSpell = false;
  }

  setIsLoadingSpell(value) {
    this.isLoadingSpell = value;
  }

  getIsLoadingSpell() {
    return this.isLoadingSpell;
  }

  getHeals() {
    return this.heals;
  };

  getHealById(healId) {
    for (let i = 0; i < this.getHeals().length; i++) {
      if (this.getHeals()[i].id === healId) {
        return this.getHeals()[i];
      }
    }
    throw "No heal for this id : " + healId;
  }

  // Loop each hero to get last time a spell was used
  getLastTimeSpellUsed(spellId?: string) {
    let result = moment().clone().startOf('day');
    for (let i = 0; i < this.raidProviderService.getRaid().length; i++) {
      let currentHeroSpells = this.raidProviderService.getRaid()[i].getSpellsOnHero();
      for (let j = 0; j < currentHeroSpells.length; j++) {

        // Retreive last update moment of defined spell
        if (spellId != undefined && currentHeroSpells[j].spellId === spellId && currentHeroSpells[j].lastTimeUsed.isAfter(result)) {
          result = currentHeroSpells[j].lastTimeUsed.clone();
          let tst = spellId != currentHeroSpells[j].id;
        }
        // Retreive last update moment of any spell
        else if (spellId === undefined && currentHeroSpells[j].lastTimeUsed.isAfter(result)) {
          result = currentHeroSpells[j].lastTimeUsed.clone();
        }
      }

    }
    return result;
  }

  isHealOnCooldown(spellId: string, inputMoment) {
    let lastTimeSpellUsed = this.getLastTimeSpellUsed();
    let isGlobalCooldown = !inputMoment.clone().subtract(this.globalCooldown, 'millisecond').isAfter(lastTimeSpellUsed);

    let lastTimeInputHealUsed = this.getLastTimeSpellUsed(spellId);
    let isHealOnCooldown = !inputMoment.clone().subtract(this.getHealById(spellId).cooldown, 'millisecond').isAfter(lastTimeInputHealUsed);

    return isGlobalCooldown || isHealOnCooldown;
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

  // EXCEPTION: Expression has changed after it was checked.
  getHealCooldown(spellId: string, inputMoment) {
    var now = inputMoment; //todays date
    var lastTime = this.getLastTimeSpellUsed(spellId) // another date
    var duration = this.getHealById(spellId).cooldown/1000 - Math.round(moment.duration(now.diff(lastTime)).asSeconds());
    return duration > 0 ? duration + "s" : "";
  }

  /*
    // active if not on cd
    isSpellActive(inputSpellId){
      let result = false;
      for (let i = 0 ; i < this.spellsOnHero.length ; i++){
        if (this.spellsOnHero[i].spellId === inputSpellId){
          var now = moment().clone(); //todays date
          var lastTime = this.spellsOnHero[i].lastTimeUsed; // another date
          var duration = moment.duration(now.diff(lastTime)).asMilliseconds();
          result = duration <= 5000 ? true : false; // todo dynamic value
          break;
        }
      }
      return result;
    }
  */

}
