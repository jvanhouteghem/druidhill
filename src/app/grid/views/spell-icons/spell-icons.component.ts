import { Component, OnInit } from '@angular/core';
import {SpellProviderService} from './../../services/spell-provider.service';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-spell-icons',
  templateUrl: './spell-icons.component.html',
  styleUrls: ['./spell-icons.component.css']
})
export class SpellIconsComponent implements OnInit {

  constructor(private spellProviderService:SpellProviderService) { }

  ngOnInit() {
  }

  _isHealOnCooldown(healId:string){
    return this.spellProviderService.isHealOnCooldown(healId, moment());
  }

}
