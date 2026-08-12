import { TestBed } from '@angular/core/testing';

import { MessageService } from './message';
import { provideHttpClient } from '@angular/common/http';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
