import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBarsComponent } from './player-bars.component';

describe('PlayerBarsComponent', () => {
  let component: PlayerBarsComponent;
  let fixture: ComponentFixture<PlayerBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
