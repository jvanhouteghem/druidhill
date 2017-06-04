import { Component, OnInit } from '@angular/core';
import {RaidProviderService} from './services/raid-provider.service';
import {RaidDmgService} from './services/raid-dmg.service';
import {BossProviderService} from './services/boss-provider.service';
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
    private raidDmgService: RaidDmgService,
    private bossProviderService:BossProviderService
  ) { 'ngInject'; }

  t:any;

  ngOnInit () {
    this.raidProviderService.generateRaid();//.then(()=>this.t=setInterval(this.doDmg,1000));
    this.raidDmgService.doBossPattern(this.bossProviderService.getBoss());
  }

  _getRaid(){
    return this.raidProviderService.getRaid();
  }

  getCSSGradient(playerId:number){
    let player = this.raidDmgService._getRaid()[playerId];
    return "linear-gradient(0deg, " + player.getClassColor() + " " + this._getPlayerHealthInPercent(player.getId()) + "%, #4a4a4a 0%)"; // Warning, don't add ";" in string // life / background
  }

  _changePlayerHealth(player: Player,inputNb: number){
    this.raidDmgService.changePlayerHealth(player, inputNb);
  }

  _getPlayerHealthInPercent(playerId:number){
    return this.raidDmgService._getRaid()[playerId].getCurrentHealthInPercent();
  }

  leftClickOnPlayer(evt, playerId){
    let player = this.raidDmgService._getRaid()[playerId];
    /*if (evt.altKey == true){
      console.log("left + alt");
      this.raidDmgService.lifebloom(playerId);
    }       
    else if (evt.ctrlKey == true){
      this.raidDmgService.changePlayerHealthOnTime(player, 1000);
      console.log("left + ctrl");
    }
    else {*/
      this._changePlayerHealth(player,-1000);
    //}
  }

  rightClickOnPlayer(evt, playerId){
    this.raidDmgService.lifebloom(playerId);
  }

}
