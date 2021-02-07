import { Component } from '@angular/core';

@Component({
  selector: 'ngtwitch-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ngOnInit() {
    const socket = new WebSocket('ws://localhost:3333');
    socket.onopen = function() {
      console.log('Connected');
      socket.send(
        JSON.stringify({
          event: 'subscribe'
        }),
      );
      socket.onmessage = function(data) {
        console.log(data);
      };
    };    
  }
}
