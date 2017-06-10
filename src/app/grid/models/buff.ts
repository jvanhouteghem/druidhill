// todo remove
export class Buff {

    private lifebloom:boolean;

    constructor(){
        this.lifebloom = false;
    }

    toggleLifeBloom(inputValue:boolean){
        // Only one lifebloom per time
        if(inputValue == true){
            if (this.lifebloom == false){
                this.lifebloom = true;
            }
        } 
        else {
            this.lifebloom = false;
        }
    }
}