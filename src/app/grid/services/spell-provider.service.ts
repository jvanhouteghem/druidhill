import { Injectable } from '@angular/core';
import * as moment from 'moment/moment';
import {Hero} from '../models/characters/hero';

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
          currentStack : 0,
          time: {
            initialDelay: 1000,
            castingTime: 0,
            period: 1000,
            duration: 8000
          },
          targetType: "single",
          cooldown: 5,
          lastTimeUsed: moment().startOf('day'), // replace by method
          usedBy:[
            {}
          ]
        },
        {
          id: "0002",
          name: "HealingTouch",
          cost: -3000,
          amount: -5000,
          maxStack: 1,
          currentStack : 0,
          time: {
            initialDelay: 0,
            castingTime: 5000,
            period: 0,
            duration: 0
          },
          targetType: "single",
          cooldown: 5,
          lastTimeUsed: moment().startOf('day') // replace by method
        }
      ]
  }

  constructor() { }

  getHeals() {
    return this.heals.heals;
  };

  getHealById(healId){
    for (let i = 0 ; i < this.getHeals().length ; i++){
      if (this.getHeals()[i].id === healId){
        return this.getHeals()[i];
      } else {
        throw "No heal for this id : " + healId; 
      }
    }
  }
  
  getLastTimeSpellUsed(){
    let result = moment().clone().startOf('day');
    for (let i = 0 ; i < this.getHeals().length ; i++){
      if(this.getHeals()[i].lastTimeUsed.isAfter(result)){
        result = this.getHeals()[i].lastTimeUsed.clone();
      }
    }
    return result;
  }

  isHealOnCooldown(spellId, inputMoment){
    let lastTimeSpellUsed = this.getHealById(spellId).lastTimeUsed;
    let compare = !inputMoment.clone().subtract(this.globalCooldown, 'millisecond').isAfter(this.getLastTimeSpellUsed());
    return compare;
  }

  updateLastTimeUsed(healId){
    this.getHealById(healId).lastTimeUsed = moment().clone();
  }

  tryAddSpellOnHero(hero:Hero, inputSpellId, inputSpellUsedTime){
    let isAlready = hero.isSpellInSpellArray(inputSpellId);
    if(!isAlready){
      hero.addSpell(inputSpellId, inputSpellUsedTime);
    } 
    else {
      hero.updateSpell(inputSpellId, inputSpellUsedTime);
    }
  }

}
