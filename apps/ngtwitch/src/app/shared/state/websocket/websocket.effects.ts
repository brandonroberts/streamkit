import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { Actions, createEffect, OnInitEffects, ofType } from "@ngrx/effects";
import { webSocket } from 'rxjs/webSocket';
import { tap } from 'rxjs/operators';

import { environment } from "../../../../environments/environment";

import { init } from "./websocket.actions";
import { TwitchActions } from '@ngtwitch/actions';

@Injectable()
export class WebSocketEffects implements OnInitEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(init),
      tap(() => {
        const subj = webSocket(`ws://localhost:8000/ws/twitch-events/`)
        // subj.subscribe(this.store);
        subj.subscribe((event: any) => {
          console.log(event);
          if (event.event_type === "follow") {
            this.store.dispatch(TwitchActions.follow({ follower: event.event_data.user_name }))
          }
          if (event.event_type === "raid") {
            this.store.dispatch(TwitchActions.raid({ raid: {
              user: event.event_data.from_broadcaster_user_name,
              message: ``,
              viewers: event.event_data.viewers,
              flags: {}
            } }))
          }
        });

        subj.next({
          // event: 'subscribe'
          token: environment.wsToken
        });
      })
    );
  }, { dispatch: false });

  constructor(private actions$: Actions, private store: Store) { }

  ngrxOnInitEffects() {
    return init();
  }
}