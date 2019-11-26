import { TestBed } from '@angular/core/testing';

import { TopAppBarService } from './top-app-bar.service';

describe('TopAppBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopAppBarService = TestBed.get(TopAppBarService);
    expect(service).toBeTruthy();
  });
});
