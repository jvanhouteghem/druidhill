import { Component, OnInit } from '@angular/core';
import {PlayerProviderService} from './../../services/player-provider.service';
import {SpellProviderService} from './../../services/spell-provider.service';

@Component({
  selector: 'app-player-bars',
  templateUrl: './player-bars.component.html',
  styleUrls: ['./player-bars.component.css']
})
export class PlayerBarsComponent implements OnInit {

  constructor(
    private playerProviderService:PlayerProviderService,
    private spellProviderService:SpellProviderService
  ) {}

  ngOnInit() {
  }

  getPlayer(){
    return this.playerProviderService.getPlayer();
  }

  _isLoadingSpell(){
    return this.spellProviderService.getIsLoadingSpell();
  }

}
