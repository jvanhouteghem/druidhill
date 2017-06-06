// A character can be a boss, a hero or a player.

export class Character {

    private name: string;
    private baseHealth: number;
    private dmgTaken: number;

    constructor(name:string, baseHealth:number) { 
        this.name = name;
        this.baseHealth = baseHealth;
        this.dmgTaken = 0;
    }

    getName(): string {
        return this.name;
    }

    getBaseHealth() {
        return this.baseHealth;
    }

    setBaseHealth(baseHealth) {
        this.baseHealth = baseHealth;
    }

    getCurrentHealth() {
        return this.baseHealth - this.dmgTaken;
    }

    getCurrentHealthInPercent() {
        return ((this.baseHealth - this.dmgTaken) / this.baseHealth) * 100;
    }

    getDmgTaken() {
        return this.dmgTaken;
    }

    setDmgTaken(dmgTaken) {
        this.dmgTaken = dmgTaken;
    }

    isDead() {
        return this.getCurrentHealth() <= 0 ? true : false;
    }

    kill() {
        this.dmgTaken = this.baseHealth;
    }

}