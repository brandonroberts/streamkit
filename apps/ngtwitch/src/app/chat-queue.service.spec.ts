import { TestBed } from '@angular/core/testing';

import { ChatQueueService } from './chat-queue.service';

describe('ChatQueueService', () => {
  let service: ChatQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
