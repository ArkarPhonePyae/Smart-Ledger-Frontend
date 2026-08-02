import { TestBed } from '@angular/core/testing';

import { ExpenseApi } from './expense-api';

describe('ExpenseApi', () => {
  let service: ExpenseApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
