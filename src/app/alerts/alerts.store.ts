import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import { merge, from, Observable, of } from 'rxjs';
import { filter, map, tap, skipWhile, concatMap, delay, switchMap } from 'rxjs/operators';

import { ChatBotService } from '../chatbot.service';
import { GifSearchService } from '../gif-search.service';
import { Alert, alerts, PAUSE_DURATION, commandResponses } from './config';

export interface AlertsState {
  text: string | null;
  alert?: {
    user: string;
    alert: Alert;
  }
  paused: boolean;
}

export const initialState: AlertsState = {
  text: null,
  paused: false
};

const onCommand = (chatCommand: string) => (source$: Observable<{ command: string, message: string }>) => {
  return source$.pipe(
    filter(({command}) => command === chatCommand)
  );
}

@Injectable({
  providedIn: 'root'
})
export class AlertsStore extends ComponentStore<AlertsState> {
  commands$ = this.chatbotService.command$;
  broadcast$ = this.chatbotService.broadcast$;
  alert$ = this.select(state => state.alert).pipe(filter(alert => !!alert));
  text$ = this.select(state => state.text);

  constructor(
    private chatbotService: ChatBotService,
    private gifSearchService: GifSearchService
  ) {
    super(initialState);
  }

  setAlert = this.updater((state, alertInfo: { user: string, alert: Alert}) => {
    return {
      ...state,
      alert: alertInfo
    };
  });

  setText = this.updater((state, text: string) => {
    return {
      ...state,
      text
    };
  });

  setPaused = this.updater((state, paused: boolean) => {
    return {
      ...state,
      paused
    };
  });  

  alertTriggers$ = merge(this.commands$, this.broadcast$).pipe(
    filter(({command}) => !!alerts[command]),
    map(({command, user, message}) => {
      const alert = alerts[command];
      
      return {
        user: alert.showMessage ? message : user,
        alert
      };
    }),
    tap((alertInfo) => this.setAlert(alertInfo))
  );

  showAlerts$ = this.alert$.pipe(
    skipWhile(alert => this.get().paused),
    concatMap(({user, alert}) => {
      return from(alert.audio.play().catch((e) => console.warn(e)))
        .pipe(
          tap(() => this.setText(`
            <h1 class="text-shadows">${user}${alert.title}</h1>
            <img src="${alert.gif}" />
          `)),
          delay(alert.duration),
          tap(() => this.setText(null))
        );
    })
  );

  broadcasts$ = this.broadcast$.pipe(
    onCommand('pause'),
    switchMap(() => {
      return of(true)
        .pipe(
          tap(() => this.setPaused(true)),
          delay(PAUSE_DURATION),
          tap(() => this.setPaused(false))
        );
    })
  );

  gifs$ = merge(this.commands$, this.broadcast$).pipe(
    onCommand('gif'),
    concatMap(({message}) => {
      return this.gifSearchService.search(message)
        .pipe(
          tap(gifUrl => this.setText(`
            <h1 class="text-shadows">${message}</h1>
            <img src="${gifUrl}" />
          `)),
          delay(5000),
          tap(() => this.setText(null))
        );
    })
  );

  responseCommand$ = this.commands$.pipe(
    filter(incomingCommand => !!commandResponses[incomingCommand.command]),
    tap(commandInfo => {
      const responseInfo = commandResponses[commandInfo.command];

      this.chatbotService.respond(responseInfo.response);
    })
  );

  init = this.effect(() => {
    this.chatbotService.init();

    return merge(
      this.alertTriggers$,
      this.showAlerts$,
      this.broadcasts$,
      this.gifs$,
      this.responseCommand$
    );
  });
}
