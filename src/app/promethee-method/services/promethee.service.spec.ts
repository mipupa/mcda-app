import { TestBed } from '@angular/core/testing';

import { PrometheeService } from './promethee.service';

describe('PrometheeService', () => {
  let service: PrometheeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrometheeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
