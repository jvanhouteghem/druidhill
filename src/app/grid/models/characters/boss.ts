import {Character} from './character';
import {Hero} from './hero';

export class Boss extends Character {

    private difficulty: string;

    constructor(name:string, baseHealth:number, difficulty:string) {
        super(name, baseHealth);
        this.difficulty = difficulty;
    }

    getDifficulty(){
        return this.difficulty;
    }

  setFocus(hero:Hero){
    hero.setIsFocusByBoss(true);
    hero.setTankValue(true); // If tank is dead then the next target become the tank even if she is weak
  }

}