import { Character } from './character';
import * as moment from 'moment/moment';

export class Player extends Character {

    private baseMana: number;
    private currentMana: number;

    // Global cooldown
    // When use a spell it compare lastTimeSpellUsed and currentTime then if coooldown delta is ok register currentTime in lastTimeSpellUsed
    // todo moove to spell provider service
    private globalCooldown: number; // cooldown before to use other spell
    private lastTimeSpellUsed: any; // timestamp

    constructor(name: string, baseHealth: number, baseMana: number) {
        super(name, baseHealth);
        this.baseMana = baseMana;
        this.currentMana = this.baseMana;

        this.globalCooldown = 800;
        this.lastTimeSpellUsed = moment().startOf('day');
    }

    // todo moove to spell-service
    /*getLastTimeSpellUsed(){
        return this.lastTimeSpellUsed;
    }

    trySetLastTimeSpellUsed(inputMoment:any){
        let compare = inputMoment.clone().subtract(this.globalCooldown, 'millisecond').isAfter(this.lastTimeSpellUsed);
        if(compare === true){
            this.lastTimeSpellUsed = inputMoment.clone();
        }
        return compare;
    }*/

    // negative to reduce current mana / positive to increase current mana
    updateMana(mana) {
        if (this.currentMana + mana > this.baseMana) {
            this.currentMana = this.baseMana;
        } else if (this.currentMana + mana < 0) {
            throw "Mana can't be negative";
        } else {
            this.currentMana += mana;
        }
    }

    getCurrentMana() {
        return this.currentMana;
    }

    getBaseMana() {
        return this.baseMana;
    }

    getCurrentManaInPercent() {
        return this.currentMana / this.baseMana * 100;
    }

    isDead() {
        if ((this.getCurrentHealth() <= 0)) {
            return true;
        } else {
            return false;
        }
    }

    getRegenManaPerSecond() {
        return 500;
    }


    isEnoughMana(manaCost:number){
        return this.getCurrentMana() >= Math.abs(manaCost) ? true : false;
    }

}