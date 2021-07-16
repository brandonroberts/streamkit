import { Component, OnInit } from '@angular/core';
import { YouTubeService } from '../../shared/state/youtube/youtube.service';

@Component({
  selector: 'youtube-overlay-broadcasts',
  template: `
    <h2>Broadcasts</h2>

    <button (click)="onStopPolling()">Stop Polling</button>

    <ul>
      <li *ngFor="let broadcast of broadcasts$ | async">
        {{ broadcast.snippet.description }}
        <a
          routerLink="/messages"
          [queryParams]="{ liveChatId: broadcast.snippet.liveChatId }"
          >Messages</a
        >
      </li>
    </ul>
  `,
})
export class BroadcastsComponent implements OnInit {
  broadcasts$ = this.youtubeService.getBroadcasts();

  constructor(private youtubeService: YouTubeService) {}

  ngOnInit(): void {}

  onStartPolling(liveChatId: string) {
    this.youtubeService.start(liveChatId).subscribe();
  }

  onStopPolling() {
    this.youtubeService.stop().subscribe();
  }
}
