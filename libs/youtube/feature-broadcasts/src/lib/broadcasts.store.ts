import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { YouTubeService } from '@streamkit/youtube/data-access-youtube';
import { Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

export interface BroadcastsState {
  items: any[]
};

const initialState: BroadcastsState = {
  items: []
};

@Injectable()
export class BroadcastsStore extends ComponentStore<BroadcastsState> {
  broadcasts$ = this.select(state => state.items);

  constructor(private youtubeService: YouTubeService) {
    super(initialState);
  }

  updateBroadcasts = this.updater((state, payload: { broadcasts: any[] }) => {
    return {
      ...state,
      items: payload.broadcasts
    };
  });

  getBroadcasts = this.effect(trigger$ => {
    return trigger$.pipe(exhaustMap(() => {
      return this.youtubeService.getBroadcasts()
        .pipe(tapResponse(broadcasts => {
          this.updateBroadcasts({ broadcasts })
        }, () => {}));
    }))
  });

  startPolling = this.effect((liveChatId$: Observable<string>) => {
    return liveChatId$.pipe(exhaustMap((liveChatId) => {
      return this.youtubeService.start(liveChatId)
        .pipe(tapResponse(() => {}, () => {}));
    }))
  });

  stopPolling = this.effect((trigger$) => {
    return trigger$.pipe(exhaustMap(() => {
      return this.youtubeService.stop()
        .pipe(tapResponse(() => {}, () => {}));
    }))
  });  
}
