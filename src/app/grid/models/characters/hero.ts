import { Buff } from './../buff';
import { Character } from './character';

export class Hero extends Character {

  private id: number;
  public buff: Buff;
  private classColor: string;
  private isTank: boolean; // boss focus tank at first
  private isPlayer: boolean;
  private isFocusByBoss;

  constructor(id: number, name: string, baseHealth: number, classColor: string, isTank = false, isPlayer = false) {
    super(name, baseHealth);
    this.id = id;
    this.buff = new Buff();
    this.classColor = classColor;
    this.isTank = isTank;
    this.isFocusByBoss = false;
    this.isPlayer = isPlayer;
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

}