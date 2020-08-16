import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

import { ChatBotService } from '../chatbot.service';
import { wait } from '../utils';

import { Alert, alerts } from './config';

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

  constructor(private chatbotService: ChatBotService) {}

  ngOnInit(): void {
    this.chatbotService.init();
    
    merge(this.commands$, this.broadcast$).pipe(
      filter(({command}) => !!alerts[command]),
      tap(({command, user, message}) => {
        const alert = alerts[command];
        this.addAlert(alert.showMessage ? message : user, alert);
      })
    ).subscribe();
  }

  addAlert(user: string, alert: Alert) {
    this.chatbotService.addAlert(async () => {
      await alert.audio.play();

      this.text$.next(`
        <h1 class="text-shadows">${user}${alert.title}</h1>
        <img src="${alert.gif}" />
      `);

      await wait(alert.duration);

      this.cleanupAlert();
    });
  }

  cleanupAlert() {
    setTimeout(() => {
      if (this.chatbotService.isIdle()) {
        this.text$.next(null);
      }
    });
  }
}
