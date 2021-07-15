import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YouTubeService {
  constructor(private http: HttpClient) {}

  getBroadcasts() {
    return this.http.get<{ items: any[] }>('/api/youtube/broadcasts')
      .pipe(map(response => response.items.filter(item => item.status.lifeCycleStatus !== "complete")));
  }

  getSubscriptions() {
    return this.http.get<{ items: any[] }>('/api/youtube/subscriptions')
      .pipe(map(response => response.items));
  }

  start(liveChatId: string) {
    return this.http.get(`/api/youtube/start?liveChatId=${liveChatId}`);
  }

  stop() {
    return this.http.get('/api/youtube/stop');
  }

  refresh() {
    return this.http.get('/api/youtube/refresh');
  }

  postMessage(liveChatId: string, message: string) {
    return this.http.post(`/api/youtube/liveChatMessages?liveChatId=${liveChatId}`, { message });
  }
}