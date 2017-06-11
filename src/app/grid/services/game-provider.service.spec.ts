import { TestBed, inject } from '@angular/core/testing';

import { GameProviderService } from './game-provider.service';

describe('GameProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameProviderService]
    });
  });

  it('should ...', inject([GameProviderService], (service: GameProviderService) => {
    expect(service).toBeTruthy();
  }));
});
