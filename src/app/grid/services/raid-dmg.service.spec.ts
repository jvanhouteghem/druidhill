import { TestBed, inject } from '@angular/core/testing';

import { RaidDmgService } from './raid-dmg.service';

describe('RaidDmgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaidDmgService]
    });
  });

  it('should ...', inject([RaidDmgService], (service: RaidDmgService) => {
    expect(service).toBeTruthy();
  }));
});
