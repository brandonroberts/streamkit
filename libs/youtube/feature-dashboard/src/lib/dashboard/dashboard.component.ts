import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'youtube-overlay-dashboard',
  template: `
    <ion-toolbar color="tertiary">
      <ion-buttons slot="start">
        <ion-menu-button auto-hide="false"></ion-menu-button>
      </ion-buttons>

      <ion-title>StreamKit</ion-title>
    </ion-toolbar>

    <ion-router-outlet></ion-router-outlet>
  `,
})
export class DashboardComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {}
}
