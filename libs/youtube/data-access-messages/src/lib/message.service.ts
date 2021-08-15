import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  pinMessage(id: string) {
    return this.http.post('/api/youtube/messages/pin', { id });
  }
}
