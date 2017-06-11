import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellIconsComponent } from './spell-icons.component';

describe('SpellIconsComponent', () => {
  let component: SpellIconsComponent;
  let fixture: ComponentFixture<SpellIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
