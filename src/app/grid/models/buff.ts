// todo remove
export class Buff {

    private lifebloom:number;

    constructor(){
        this.lifebloom = 0;
    }

    toggleLifeBloom(inputValue:boolean){
        // Only one lifebloom per time
        if(inputValue == true){
            this.lifebloom++;
        } 
        else {
            this.lifebloom--;
        }
    }
}