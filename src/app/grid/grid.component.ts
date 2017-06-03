import { Component, OnInit } from '@angular/core';
import {RaidProviderService} from './services/raid-provider.service';
import {RaidDmgService} from './services/raid-dmg.service';
import {Player} from './models/player';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

// Only for event and display
  constructor (
    private raidProviderService:RaidProviderService,
    private raidDmgService: RaidDmgService
  ) { 'ngInject'; }

  t:any;

  ngOnInit () {
    this.raidProviderService.generateRaid();//.then(()=>this.t=setInterval(this.doDmg,1000));
    this.loadBossPattern();
  }

  loadBossPattern(){
    // Interval
    let subscription: Subscription;
    let timer = Observable.timer(1000,1000);
    let count = 0;
    subscription = timer.subscribe(t=> {
        count++;
        let player = this.raidDmgService._getRaid()[0];
        this._changePlayerHealth(player, 2000); // Ne pas appeller directement le service
        if (count >= 5){
          subscription.unsubscribe();
        }
    });
  }

  _getRaid(){
    return this.raidProviderService.getRaid();
  }

  getCSSGradient(playerId:number){
    return "linear-gradient(0deg, #839b55 " + this._getPlayerHealthInPercent(playerId) + "%, #4a4a4a 0%)"; // Warning, don't add ";" in string
  }

  _changePlayerHealth(player: Player,inputNb: number){
    this.raidDmgService.changePlayerHealth(player, inputNb);
  }

  _getPlayerHealthInPercent(playerId:number){
    return this.raidDmgService._getRaid()[playerId].getCurrentHealthInPercent();
  }

  // Detect left click on player, then call service which know what to do (is he died ? then nothing, is he debuff ? then .. etc.)
  /*clickOnPlayer(evt, playerId){
    let player = this.raidDmgService._getRaid()[playerId];
    switch(evt.which) {
      case 1: // left click
        this._changePlayerHealth(player,-1000);
        break;
      case 2: // middle click
        this.raidDmgService.changePlayerHealthOnTime(player, 1000);
        break;
      case 3: // right click
        this.raidDmgService.lifebloom(playerId);
        break;
    }
  }*/

  leftClickOnPlayer(evt, playerId){
    let player = this.raidDmgService._getRaid()[playerId];
    if (evt.altKey == true){
      console.log("left + alt");
      this.raidDmgService.lifebloom(playerId);
    }       
    else if (evt.ctrlKey == true){
      this.raidDmgService.changePlayerHealthOnTime(player, 1000);
      console.log("left + ctrl");
    }
    else {
      this._changePlayerHealth(player,-1000);
    }
  }

  rightClickOnPlayer(evt, playerId){
    this.raidDmgService.lifebloom(playerId);
  }

}
