import { Character } from './character';
import * as moment from 'moment/moment';

export class Hero extends Character {

  private id: number;
  private classColor: string;
  private isTank: boolean; // boss focus tank at first
  private isPlayer: boolean;
  private isFocusByBoss;

  private spellsOnHero:any; // todo add type

  constructor(id: number, name: string, baseHealth: number, classColor: string, isTank = false, isPlayer = false) {
    super(name, baseHealth);
    this.id = id;
    this.classColor = classColor;
    this.isTank = isTank;
    this.isFocusByBoss = false;
    this.isPlayer = isPlayer;
    this.spellsOnHero = [];
  }

  getClassColor() {
    return this.classColor;
  }

  getId() {
    return this.id;
  }

  isDead() {
    if ((this.getCurrentHealth() <= 0)) {
      return true;
    } else {
      return false;
    }
  }

  getTankValue() {
    return this.isTank;
  }

  setTankValue(tankValue) {
    this.isTank = tankValue;
  }

  setIsFocusByBoss(isFocus: boolean) {
    this.isFocusByBoss = isFocus;
  }

  getIsPlayer() {
    return this.isPlayer;
  }

  isHealingPossible(){
    // Cannot receive heal if full or if not enough mana
    if (this.isDead()){
      return false;
    } else {
      return true;
    }
  }

  isDmgPossible(){
    // Cannot receive anymore damage if dead
    if (this.isDead()){
      return false;
    } else {
      return true;
    }
  }

  isFullLife(){
    if ((this.getCurrentHealth() === this.getBaseHealth())){
      return true;
    } else {
      return false;
    }
  }

  // move inside char
  isHealExceedBaseHealth(inputValue){
    if (inputValue > this.getDmgTaken()){
      return true;
    } else {
      return false;
    }
  }

  // move inside char
  isLethalDmg(inputValue){
    if (this.getCurrentHealth() - inputValue <= 0){
      return true;
    } else {
      return false;
    }
  }

  addSpell(inputSpellId, inputSpellUsedTime){
    let spell = {spellId : inputSpellId, lastTimeUsed : inputSpellUsedTime};
    this.spellsOnHero.push(spell);
  }

  updateSpell(inputSpellId, inputSpellUsedTime){
    for (let i = 0 ; i < this.spellsOnHero.length ; i++){
      if (this.spellsOnHero[i].spellId === inputSpellId){
        this.spellsOnHero[i].lastTimeUsed = inputSpellUsedTime;
      }
    }
  }

  isSpellInSpellArray(inputSpellId){
    let result = false;
    for (let i = 0 ; i < this.spellsOnHero.length ; i++){
      if (this.spellsOnHero[i].spellId === inputSpellId){
        result = true;
      }
    }
    return result;
  }

  getSpellsOnHero(){
    return this.spellsOnHero;
  }

  // active if not on cd
  isSpellActive(inputSpellId){
    let result = false;
    for (let i = 0 ; i < this.spellsOnHero.length ; i++){
      if (this.spellsOnHero[i].spellId === inputSpellId){
        var now = moment().clone(); //todays date
        var lastTime = this.spellsOnHero[i].lastTimeUsed; // another date
        var duration = moment.duration(now.diff(lastTime)).asMilliseconds();
        result = duration <= 5000 ? true : false;
        break;
      }
    }
    return result;
  }

}