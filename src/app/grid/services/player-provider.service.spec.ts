import { TestBed, inject } from '@angular/core/testing';
import { PlayerProviderService } from './player-provider.service';

describe('PlayerProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerProviderService]
    });
  });

  it('should ...', inject([PlayerProviderService], (service: PlayerProviderService) => {
    expect(service).toBeTruthy();
  }));
});
