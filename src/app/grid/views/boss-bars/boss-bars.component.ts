import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boss-bars',
  templateUrl: './boss-bars.component.html',
  styleUrls: ['./boss-bars.component.css']
})
export class BossBarsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.initializeHealthBar();
  }

  initializeHealthBar(){
    var elem = document.getElementById("bossHealthBar");
    elem.style.width = '100%';
  }

}
