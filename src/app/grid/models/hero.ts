import { Buff } from './buff';
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

}