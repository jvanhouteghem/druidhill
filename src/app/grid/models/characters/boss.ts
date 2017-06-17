import { Character } from './character';
import { Hero } from './hero';

export class Boss extends Character {

    private difficulty: string;

    constructor(name: string, baseHealth: number, difficulty: string) {
        super(name, baseHealth);
        this.difficulty = difficulty;
    }

    getDifficulty() {
        return this.difficulty;
    }

    setFocus(hero: Hero) {
        hero.setIsFocusByBoss(true);
        hero.setTankValue(true); // If tank is dead then the next target become the tank even if she is weak
    }
    

    getAttacks() {
        return {
            easy: [
                {
                    id: "001", // le type d'attaque, exemple simple damage pour 001
                    target: ["T", "R"], // T tank, R Random, P Player, L Lower, H Higher, ZC zone cross
                    damages: 2000,
                    period: 1000,
                    addFocus: true
                }
            ],
            normal: [
                {
                    id: "001", // le type d'attaque, exemple simple damage pour 001
                    target: ["T"], // T tank, R Random, P Player, L Lower, H Higher
                    damages: 500, // todo replace max min [500, 2500] and add random
                    period: 500,
                    addFocus: true
                    // todo add critick chances
                },
                {
                    id: "001", // le type d'attaque, exemple simple damage
                    target: ["R"], // T tank, R Random, P Player, L Lower, H Higher
                    damages: 1000,
                    period: 1000,
                    addFocus: false
                }
            ],
        }
    }

}