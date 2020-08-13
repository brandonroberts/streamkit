import { Component, OnInit } from '@angular/core';
import { ChatBotService } from '../chatbot.service';

@Component({
  selector: 'ngtwitch-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  constructor(private chatbotService: ChatBotService) { }

  ngOnInit(): void {
    this.chatbotService.init();
  }

}
