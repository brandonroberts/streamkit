import { Injectable } from '@angular/core';

import ComfyJS, { OnMessageFlags } from 'comfy.js';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { ChatQueueService } from './chat-queue.service';

/* Config */
const PAUSE_DURATION = 30 * 1000; // 30 seconds

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private _command$ = new Subject<{ user: string, command: string, message: string, flags: OnMessageFlags }>();
  private _chat$ = new Subject();

  command$ = this._command$.asObservable();
  broadcast$ = this._command$.pipe(filter(({flags}) => flags.broadcaster));
  chat$ = this._chat$.asObservable();

  constructor(private chatQueueService: ChatQueueService){}

  init() {
    ComfyJS.Init(environment.twitchTvHandle);

    this.setupCommandListener();
    this.setupChatListener();
  }

  setupCommandListener() {
    ComfyJS.onCommand = (user, command, message, flags, extra) => {
      console.log(`!${command} was typed in chat`);

      this._command$.next({
        user,
        command,
        message,
        flags
      })
    };

    this.broadcast$.subscribe(({command}) => {
      if (command == "pause") {
        // Clear GIF queue and pause for PAUSE_DURATION
        this.chatQueueService.clear();
        this.chatQueueService.pause(PAUSE_DURATION);
      }      
    });     
  }

  setupChatListener() {
    ComfyJS.onChat = (user, message, flags, self, extra) => {
      console.log(user + ":", message);
    };
  }

  addAlert(item: () => Promise<void>) {
    this.chatQueueService.add(item);    
  }

  isIdle(){
    return !this.chatQueueService.isLooping;
  }
}
