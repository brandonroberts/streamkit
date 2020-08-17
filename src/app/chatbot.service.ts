import { Injectable } from '@angular/core';

import ComfyJS, { OnMessageFlags } from 'comfy.js';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private _command$ = new Subject<{ user: string, command: string, message: string, flags: OnMessageFlags }>();
  private _chat$ = new Subject();

  command$ = this._command$.asObservable();
  broadcast$ = this._command$.pipe(filter(({flags}) => flags.broadcaster));
  chat$ = this._chat$.asObservable();

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
  }

  setupChatListener() {
    ComfyJS.onChat = (user, message, flags, self, extra) => {
      console.log(user + ":", message);
    };
  }
}
