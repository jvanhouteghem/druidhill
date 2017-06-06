// todo inheritance
export class Player {

    private name:string;
    private baseMana:number;
    private currentMana:number;
    private baseHealth:number;
    private dmgTaken:number;

    constructor(name:string, baseHealth:number, baseMana:number){
        this.name = name;
        this.baseHealth = baseHealth;
        this.dmgTaken = 0;
        this.baseMana = baseMana;
        this.currentMana = this.baseMana;
    }

    // negative to reduce current mana / positive to increase current mana
    updateMana(mana){
        if(this.currentMana + mana > this.baseMana){
            this.currentMana = this.baseMana;
        } else if(this.currentMana + mana < 0){
            throw "Mana can't be negative";
        } else {
            this.currentMana += mana;
        }
    }

    getBaseHealth(){
        return this.baseHealth;
    }

    getCurrentMana(){
        return this.currentMana;
    }

    getBaseMana(){
        return this.baseMana;
    }

    getCurrentHealthInPercent(){
        return ((this.baseHealth - this.dmgTaken) / this.baseHealth) * 100;
    }

    getCurrentManaInPercent(){
        return this.currentMana / this.baseMana * 100;
    }

    getName(){
        return this.name;
    }

    getCurrentHealth(){
        return this.baseHealth - this.dmgTaken;
    }

    setDmgTaken(dmgTaken){
        this.dmgTaken = dmgTaken;
    }

    isDead(){
        if ((this.getCurrentHealth() <= 0)){
        return true;
        } else {
        return false;
        }
    }

    kill(){
        this.dmgTaken = this.baseHealth;
    }

    getRegenManaPerSecond(){
        return 500;
    }

}