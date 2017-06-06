import {Character} from './character';

export class Boss extends Character {

    private difficulty: string;

    constructor(name:string, baseHealth:number, difficulty:string) {
        super(name, baseHealth);
        this.difficulty = difficulty;
    }

    getDifficulty(){
        return this.difficulty;
    }

}