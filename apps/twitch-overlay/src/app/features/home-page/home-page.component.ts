import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'twitch-overlay-home-page',
  template: ` <twitch-overlay-alerts></twitch-overlay-alerts> `,
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
export class HomePageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
