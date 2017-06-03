import { TestBed, inject } from '@angular/core/testing';

import { RaidProviderService } from './raid-provider.service';

describe('RaidProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaidProviderService]
    });
  });

  it('should ...', inject([RaidProviderService], (service: RaidProviderService) => {
    expect(service).toBeTruthy();
  }));
});
