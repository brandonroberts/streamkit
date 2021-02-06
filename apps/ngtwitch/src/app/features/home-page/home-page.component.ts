import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngtwitch-home-page',
  template: `
    <ngtwitch-alerts></ngtwitch-alerts>
  `,
  styles: [
    `
      :host {
        display: grid;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
      }    
    `
  ]
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
