import {Buff} from './buff';

/*const enum ClassColor {
    DRUID = 1,
    ROGUE = A * 2
}*/

export class Player {

  private id:number;
  private name:String;
  private baseHealth:number;
  private dmgTaken:number;
  public buff:Buff;
  private classColor:string;
  private isTank:boolean; // boss focus tank at first

  //Remplacer par objet status
  public isDead:boolean;


  constructor(id:number, name:String, baseHealth:number, classColor:string, isTank=true){
      this.id = id;
      this.name = name;
      this.baseHealth = baseHealth;
      this.dmgTaken = 0;
      this.buff = new Buff();
      this.isDead = false;
      this.classColor = classColor;
      this.isTank = isTank;
  }

  getCurrentHealth(){
    return this.baseHealth - this.dmgTaken;
  }

  getClassColor(){
    return this.classColor;
  }

  getCurrentHealthInPercent(){
    return ((this.baseHealth - this.dmgTaken) / this.baseHealth) * 100;
  }

  getName():String{
    return this.name;
  }

  getBaseHealth(){
    return this.baseHealth;
  }

  setBaseHealth(baseHealth){
    this.baseHealth = baseHealth;
  }

  getId(){
    return this.id;
  }

  getDmgTaken(){
    return this.dmgTaken;
  }

  setDmgTaken(dmgTaken){
    this.dmgTaken = dmgTaken;
  }

  kill(){
    this.isDead = true;
    this.dmgTaken = this.baseHealth;
  }

}

// NOTES : 

// La partie commence quand clic sur bouton

// Un pattern est lancé, par exemple :
// - 1000 / sec sur le tank 
// - Aléatoirement 5000 de dégat sur un des personnages sauf le tank / 3 secondes
// - 10000 dégat sur tout le raid toutes les 10 secondes

// Une partie dure un temps déterminé

// Un score à la fin : 
// - Non : plus le heal total est élevé moins le score est bon
// - Oui : L'overheal fait perdre des points