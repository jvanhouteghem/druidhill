import { TestBed, inject } from '@angular/core/testing';

import { BossProviderService } from './boss-provider.service';

describe('BossProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BossProviderService]
    });
  });

  it('should ...', inject([BossProviderService], (service: BossProviderService) => {
    expect(service).toBeTruthy();
  }));
});
