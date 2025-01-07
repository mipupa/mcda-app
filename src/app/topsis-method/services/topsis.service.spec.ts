import { TestBed } from '@angular/core/testing';

import { TopsisService } from './topsis.service';

describe('TopsisService', () => {
  let service: TopsisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopsisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
