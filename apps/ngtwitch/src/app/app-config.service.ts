import { Injectable } from "@angular/core";

import { ApiConfig } from '@ngtwitch/api-interfaces';

import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: ApiConfig;

  fetch() {
    return new Promise((resolve, reject) => {
      fetch(`${environment.apiHost}/api/config`).then(response => {
        response.json().then(config => {
          this.set(config);
          resolve(true);
        });
      }).catch(() => reject('Unable to fetch config from API'));
    })
  }

  set(config: ApiConfig) {
    this.config = config;
  }

  get() {
    return this.config;
  }
}