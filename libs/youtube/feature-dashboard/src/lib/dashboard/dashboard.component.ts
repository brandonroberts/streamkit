import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'youtube-overlay-dashboard',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label color="primary">
            <h1>harry styles</h1>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label color="primary">
            <h1>christmas</h1>
          </ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-label color="primary">
            <h1>falling</h1>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    :host {
      padding-top: 75px;
    }
  `
  ]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
