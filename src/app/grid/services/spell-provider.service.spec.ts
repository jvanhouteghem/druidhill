import { TestBed, inject } from '@angular/core/testing';

import { SpellProviderService } from './spell-provider.service';

describe('SpellProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpellProviderService]
    });
  });

  it('should ...', inject([SpellProviderService], (service: SpellProviderService) => {
    expect(service).toBeTruthy();
  }));
});
