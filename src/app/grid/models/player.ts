export class Player {

    private name:string;
    private baseMana:number;
    private currentMana:number

    constructor(name:string, baseMana:number){
        this.name = name;
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

    getCurrentMana(){
        return this.currentMana;
    }

}