export class Boss {

    private name: string;
    private difficulty: string;
    private health: number;
    //private attacks: Attacks[];

    constructor(name:string, difficulty:string, health:number) { 
        this.name = name;
        this.difficulty = difficulty;
        this.health = health;
    }

    getName(){
        return this.name;
    }

    getDifficulty(){
        return this.difficulty;
    }

    getHealth(){
        return this.health;
    }

    isDead(){
        return this.health <= 0 ? true : false;
    }

}