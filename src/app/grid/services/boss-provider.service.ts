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
    this.boss = new Boss("THEBOSS", 100000, "Normal");
  }

  getBoss(){
    return this.boss;
  }

}
