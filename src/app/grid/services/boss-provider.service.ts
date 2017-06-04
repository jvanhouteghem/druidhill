import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";
import {Boss} from '../models/boss';

@Injectable()
export class BossProviderService {

  boss:Boss;

  constructor() { 
    this.initBoss();
  }

  initBoss(){
    this.boss = new Boss("THEBOSS", "Normal", 50000);
  }

  getBoss(){
    return this.boss;
  }

}
