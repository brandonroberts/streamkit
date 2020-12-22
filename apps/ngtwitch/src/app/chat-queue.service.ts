import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatQueueService {
  queue = [];
  isLooping = false;
  isPaused = false;

  async loop() {
    this.isLooping = true;

    const item = this.queue[0];
    this.queue.shift();
    await item();

    if (!this.queue.length || this.isPaused) {
      this.isLooping = false;
      return;
    }

    this.loop();
  };

  add(item: () => Promise<void>) {
    if (this.isPaused) return;

    this.queue.push(item);

    if (!this.isLooping) this.loop();
  };

  clear() {
    this.queue = [];
  };

  pause(duration = 0) {
    this.isPaused = true;
    setTimeout(() => (this.isPaused = false), duration);
  };
}
