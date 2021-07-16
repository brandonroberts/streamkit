import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AlertsActions, AlertsSelectors } from '@streamkit/youtube/shared/state/alerts';

@Component({
  selector: 'youtube-overlay-alerts',
  template: `
    <div
      class="alerts"
      [style.opacity]="opacity$ | async"
      [innerHTML]="text$ | async"
    ></div>

    <audio style="display: none;" control muted="muted" autoplay></audio>
  `,
  styles: [
    `
      :host {
        display: grid;
        justify-content: center;
        text-align: center;
      }

      .alerts {
        color: gray;
      }
    `,
  ],
})
export class AlertsComponent implements OnInit {
  text$ = this.store.select(AlertsSelectors.selectCurrentText);
  opacity$ = this.text$.pipe(map((text) => (text ? 1 : 0)));

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AlertsActions.pageEnter());
  }
}
