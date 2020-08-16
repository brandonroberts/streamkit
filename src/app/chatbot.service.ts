import { Injectable } from '@angular/core';

import ComfyJS from 'comfy.js';

import { environment } from '../environments/environment';
import { ChatQueueService } from './chat-queue.service';

/* Config */
const PAUSE_DURATION = 30 * 1000; // 30 seconds
const DISPLAY_DURATION = 10 * 1000; // 10 seconds

/* DOM */
const img = new Image();

/* Sound Effects */
const pewAudio = new Audio("/assets/horn.wav");
const magicChime = new Audio("/assets/Magic_Chime.mp3");

/* GIFs */
const beyGif = "https://media.giphy.com/media/VxkNDa92gcsRq/giphy.gif";
const welcomeGif = "https://media.giphy.com/media/l3V0doGbp2EDaLHJC/giphy.gif";
const pizzaGif = "https://media.giphy.com/media/3o6nUXaNE4wdhq8Foc/giphy.gif";

// Resolve promise after duration
const wait = async (duration: number) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  titles = {
    yo: " is hype!",
    welcome: " needs a welcome!",
    pizza: " needed a pizza party!",
  };

  constructor(private chatQueueService: ChatQueueService) {}

  init() {
    ComfyJS.Init(environment.twitchTvHandle);

    this.setupCommandListener();
    this.setupChatListener();
  }

  setupCommandListener() {
    ComfyJS.onCommand = (user, command, message, flags, extra) => {
      console.log(`!${command} was typed in chat`);
    
      if (command == "yo") {
        this.gifAlert(user, beyGif, pewAudio, command);
      }

      if (command == "ngrx") {
        this.gifAlert(user, pizzaGif, magicChime, command);
      }      
    
      if (command == "welcome") {
        this.gifAlert(message, welcomeGif, magicChime, command);
      }
    
      if (flags.broadcaster && command == "pizza") {
        this.gifAlert(message, pizzaGif, magicChime, command);
      }
    
      if (flags.broadcaster && command == "pause") {
        // Clear GIF queue and pause for PAUSE_DURATION
        this.chatQueueService.clear();
        this.chatQueueService.pause(PAUSE_DURATION);
      }
    };
  }

  setupChatListener() {
    ComfyJS.onChat = (user, message, flags, self, extra) => {
      console.log(user + ":", message);
    };
  }
  
  gifAlert(user: string, gif: string, audio: HTMLAudioElement, type: string) {
    this.chatQueueService.add(async () => {
      const container: any = document.querySelector(".alerts");
      try {
        await audio.play().catch(e => {console.warn(e)});
      } catch(e) {}

      container.innerHTML = `
        <h1 class="text-shadows">${user + (this.titles[type] || '')}</h1>
        <img src="${gif}" />
      `;
      container.style.opacity = 1;
  
      await wait(DISPLAY_DURATION);
  
      setTimeout(() => {
        if (!this.chatQueueService.isLooping) {
          container.style.opacity = 0;
        }
      });
    });
  }  
}
