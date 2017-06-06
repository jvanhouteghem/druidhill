import { Character } from './character';

export class Player extends Character {

    private baseMana: number;
    private currentMana: number;

    constructor(name: string, baseHealth: number, baseMana: number) {
        super(name, baseHealth);
        this.baseMana = baseMana;
        this.currentMana = this.baseMana;
    }

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

}