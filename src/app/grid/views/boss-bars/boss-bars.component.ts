import { Component, OnInit } from '@angular/core';
import { BossProviderService } from './../../services/boss-provider.service';

@Component({
  selector: 'app-boss-bars',
  templateUrl: './boss-bars.component.html',
  styleUrls: ['./boss-bars.component.css']
})
export class BossBarsComponent implements OnInit {

  constructor(
    private bossProviderService:BossProviderService
  ) { }

  ngOnInit() {
    this.bossProviderService.startRaidDmgOnBoss();
  }

  _getBossCurrentHealth(){
    return this.bossProviderService.getBoss().getCurrentHealth();
  }

  _getBossBaseHealth(){
    return this.bossProviderService.getBoss().getBaseHealth();
  }

}
