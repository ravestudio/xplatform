import { TestBed } from '@angular/core/testing';

import { EmitentService } from './emitent.service';

describe('EmitentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmitentService = TestBed.get(EmitentService);
    expect(service).toBeTruthy();
  });
});
