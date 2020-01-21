import { TestBed } from '@angular/core/testing';

import { ImagesBackendProviderService } from './images-backend-provider.service';

describe('ImagesBackendProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagesBackendProviderService = TestBed.get(ImagesBackendProviderService);
    expect(service).toBeTruthy();
  });
});
