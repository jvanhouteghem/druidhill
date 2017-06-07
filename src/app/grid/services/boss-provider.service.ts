import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import {Boss} from '../models/characters/boss';

@Injectable()
export class BossProviderService {

  boss:Boss;

  constructor() { 
    this.initBoss();
  }

  initBoss(){
    this.boss = new Boss("THEBOSS", 50000, "Normal");
  }

  getBoss(){
    return this.boss;
  }

}
