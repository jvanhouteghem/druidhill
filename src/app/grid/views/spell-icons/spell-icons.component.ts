import { Component, OnInit } from '@angular/core';
import { SpellProviderService } from './../../services/spell-provider.service';
import { PlayerProviderService } from './../../services/player-provider.service';
import { RaidDmgService } from './../../services/raid-dmg.service';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-spell-icons',
  templateUrl: './spell-icons.component.html',
  styleUrls: ['./spell-icons.component.css']
})
export class SpellIconsComponent implements OnInit {

  constructor(
    private spellProviderService: SpellProviderService,
    private playerProviderService:PlayerProviderService,
    private raidDmgService:RaidDmgService
    ) { }

  ngOnInit() {
  }

  _isHealOnCooldown(healId: string) {
    return this.spellProviderService.isHealOnCooldown(healId, moment());
  }

  _getHealCooldown(healId: string) {
    return this.spellProviderService.getHealCooldown(healId, moment());
  }

  _Innervate() {
    let hero = this.playerProviderService;
    this.raidDmgService.innervate();
  }


}
