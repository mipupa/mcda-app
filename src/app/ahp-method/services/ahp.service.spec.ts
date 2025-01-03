import { TestBed } from '@angular/core/testing';

import { AhpService } from './ahp.service';

describe('AhpService', () => {
  let service: AhpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AhpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
