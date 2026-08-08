import { TestBed } from '@angular/core/testing';

import { SettingsServiceTs } from './settings.service.ts';

describe('SettingsServiceTs', () => {
  let service: SettingsServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
