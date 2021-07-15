import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { cwd } from 'process';
import * as fs from 'fs';
const fetch = require('node-fetch');

@Injectable()
export class YouTubeConfigService {
  private readonly clientId = process.env.YOUTUBE_CLIENT_ID;
  private readonly clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  private accessToken!: string;

  async getAccessToken(code: string) {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', process.env.YOUTUBE_AUTH_CALLBACK_URL);
    params.append('code', code);
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: params
    });

    const authData = await response.json();

    if (authData.error) {
      return { error: true };
    }

    this.storeCredentials(authData, authData.refresh_token);

    return { error: false };
  }

  async refreshAccessToken() {
    const responseFilePath = join(cwd(), 'yt-oauth.json');

    if (!fs.existsSync(responseFilePath)) {
      return { error: true };
    }

    const authJson = fs.readFileSync(responseFilePath).toString();
    const auth = JSON.parse(authJson);
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('refresh_token', auth.refresh_token);

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: params
    });

    const authData = await response.json();

    if (authData.error) {
      return { error: true };
    }

    this.storeCredentials(authData, auth.refresh_token);

    return { error: false };
  }

  storeCredentials(data: any, refreshToken: string) {
    this.accessToken = data.access_token;
    
    console.log('token refreshed and stored');

    fs.writeFileSync(join(cwd(), 'yt-oauth.json'), JSON.stringify({ ...data, refresh_token: refreshToken }, null, 2));
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`
    };
  }
}