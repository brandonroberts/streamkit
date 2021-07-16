import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'youtube-overlay-home-page',
  template: ` <youtube-overlay-alerts></youtube-overlay-alerts> `,
  styles: [
    `
      :host {
        display: grid;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
      }
    `,
  ],
})
export class AlertsPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
