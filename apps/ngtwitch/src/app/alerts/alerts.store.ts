import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import { merge, from, Observable, of } from 'rxjs';
import { filter, map, tap, skipWhile, concatMap, delay, switchMap } from 'rxjs/operators';

import { ChatBotService } from '../chatbot.service';
import { GifSearchService } from '../gif-search.service';
import { Command } from '@ngtwitch/models';
import { Alert, alerts, PAUSE_DURATION, commandResponses, raidGif, subGif, welcomeGif, followGif } from './config';

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

const onCommand = (chatCommand: string) =>
  (source$: Observable<Command>) => {
    return source$.pipe(
      filter(({ command }) => command === chatCommand)
    );
  }

@Injectable({
  providedIn: 'root'
})
export class AlertsStore extends ComponentStore<AlertsState> {
  commands$ = this.chatbotService.command$;
  broadcast$ = this.chatbotService.broadcast$;
  raid$ = this.chatbotService.raid$;
  sub$ = this.chatbotService.subs$;
  follows$ = this.chatbotService.follows$;
  alert$ = this.select(state => state.alert).pipe(filter(alert => !!alert));
  text$ = this.select(state => state.text);

  constructor(
    private chatbotService: ChatBotService,
    private gifSearchService: GifSearchService
  ) {
    super(initialState);
  }

  setAlert = this.updater((state, alertInfo: { user: string, alert: Alert }) => {
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
    filter(({ command }) => !!alerts[command]),
    map(({ command, user, message, flags }) => {
      const alert = alerts[command];

      if (alert.subsOnly && !flags.subscriber && !flags.broadcaster) {
        return null;
      }

      return {
        user: alert.showMessage ? message : user,
        alert
      };
    }),
    map(info => info),
    tap((alertInfo) => this.setAlert(alertInfo))
  );

  raids$ = this.raid$.pipe(
    tap(({ user, message }) => {
      this.setAlert({
        user,
        alert: {
          title: message,
          gif: raidGif,
          showMessage: true,
          duration: 3000,
          subsOnly: false
        }
      })
    })
  );

  subs$ = this.sub$.pipe(
    tap(({ user }) => {
      this.setAlert({
        user,
        alert: {
          title: ` subscribed!`,
          gif: subGif,
          showMessage: false,
          duration: 3000,
          subsOnly: false
        }
      })
    })
  );

  follow$ = this.follows$.pipe(
    tap(user => {
      this.setAlert({
        user,
        alert: {
          title: '',
          gif: followGif,
          showMessage: false,
          duration: 6000,
          subsOnly: false
        }
      })
    })
  );

  showAlerts$ = this.alert$.pipe(
    skipWhile(() => this.get().paused),
    concatMap(({ user, alert }) => {
      const audio = alert.audio ? alert.audio.play().catch((e) => console.warn(e)) : Promise.resolve(true);
      return from(audio)
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

  gifs$ = merge(this.subs$, this.broadcast$).pipe(
    onCommand('gif'),
    concatMap(({ message }) => {
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

      let message = `${responseInfo.response}`;

      if (responseInfo.response.includes('{{message}}')) {
        message = message.replace('{{message}}', commandInfo.message.substr(1));
      }

      if (responseInfo.response.includes('~message~')) {
        message = message.replace('~message~', commandInfo.message);
      }

      this.chatbotService.respond(message);
    })
  );

  init = this.effect(() => {
    this.chatbotService.init();

    return merge(
      this.alertTriggers$,
      this.showAlerts$,
      this.broadcasts$,
      this.gifs$,
      this.responseCommand$,
      this.raids$,
      this.subs$,
      this.follow$
    );
  });
}
