import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { AlertsStore } from './alerts.store';

@Component({
  selector: 'ngtwitch-alerts',
  template: `
    <div class="alerts"
      [style.opacity]="opacity$ | async"
      [innerHTML]="text$ | async">
    </div>

    <audio
      style="display: none;"
      control
      muted="muted"
      autoplay>
    </audio>
  `,
  styles: [`
    :host {
      display: grid;
      justify-content: center;
      text-align: center;
    }

    .alerts {
      color: white;
    }
  `],
  providers: [AlertsStore]
})
export class AlertsComponent implements OnInit {
  text$ = this.alertsStore.text$;
  opacity$ = this.text$.pipe(map(text => text ? 1 : 0));

  constructor(private alertsStore: AlertsStore) {}

  ngOnInit(): void {  
    this.alertsStore.init();
  }
}
