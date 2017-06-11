import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BossBarsComponent } from './boss-bars.component';

describe('BossBarsComponent', () => {
  let component: BossBarsComponent;
  let fixture: ComponentFixture<BossBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BossBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
