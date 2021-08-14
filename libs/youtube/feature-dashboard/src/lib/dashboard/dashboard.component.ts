import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'twitch-overlay-dashboard',
  template: `
    <!-- <ion-toolbar color="tertiary">
      <ion-buttons slot="start">
        <ion-menu-button auto-hide="false"></ion-menu-button>
      </ion-buttons>

      <ion-title>Dashboard</ion-title>
    </ion-toolbar> -->
    Dashboard
  `,
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
