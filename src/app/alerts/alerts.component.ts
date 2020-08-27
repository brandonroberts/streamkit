import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Subject, from, of } from 'rxjs';
import { map, filter, tap, concatMap, delay, skipWhile, switchMap } from 'rxjs/operators';

import { ChatBotService } from '../chatbot.service';
import { GifSearchService } from '../gif-search.service';

import { Alert, alerts, PAUSE_DURATION } from './config';

@Component({
  selector: 'ngtwitch-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  commands$ = this.chatbotService.command$;
  broadcast$ = this.chatbotService.broadcast$;
  text$ = new BehaviorSubject<string>(null);
  opacity$ = this.text$.pipe(map(text => text ? 1 : 0));
  alert$ = new Subject<{ user: string, alert: Alert }>();
  paused = false;

  constructor(
    private chatbotService: ChatBotService,
    private gifSearchService: GifSearchService
  ) {}

  ngOnInit(): void {
    this.chatbotService.init();
    
    merge(this.commands$, this.broadcast$).pipe(
      filter(({command}) => !!alerts[command]),
      map(({command, user, message}) => {
        const alert = alerts[command];
        
        return {
          user: alert.showMessage ? message : user,
          alert
        };
      })
    ).subscribe(this.alert$);

    this.alert$.pipe(
      skipWhile(() => this.paused),
      concatMap(({user, alert}) => {
        return from(alert.audio.play().catch((e) => console.warn(e)))
          .pipe(
            tap(() => {
              this.text$.next(`
                <h1 class="text-shadows">${user}${alert.title}</h1>
                <img src="${alert.gif}" />
              `);
            }),
            delay(alert.duration),
            tap(() => {
              this.text$.next(null);
            })
          );
      })
    )
    .subscribe();

    this.broadcast$.pipe(
      filter(({command}) => command === 'pause'),
      switchMap(() => {
        return of(true)
          .pipe(
            tap(() => this.paused = true),
            delay(PAUSE_DURATION),
            tap(() => this.paused = false)
          );
      })
    ).subscribe();

    merge(this.commands$, this.broadcast$).pipe(
      filter(({command}) => command === 'gif'),
      concatMap(({message}) => {
        return this.gifSearchService.search(message)
          .pipe(
            tap(gifUrl => {
              this.text$.next(`
                <h1 class="text-shadows">${message}</h1>
                <img src="${gifUrl}" />
              `);
            }),
            delay(5000),
            tap(() => {
              this.text$.next(null);
            })
          );
      })
    ).subscribe();
  }
}
