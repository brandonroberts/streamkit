import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { cwd } from 'process';
import * as fs from 'fs';
import { google } from 'googleapis';

const scopes = ['https://www.googleapis.com/auth/youtube'];

@Injectable()
export class YouTubeConfigService {
  private readonly clientId = process.env.YOUTUBE_CLIENT_ID;
  private readonly clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  private readonly redirectUrl = process.env.YOUTUBE_AUTH_CALLBACK_URL;
  readonly oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUrl);

  getRedirectUrl() {
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: process.env.YOUTUBE_STATE_KEY
    });

    return url;
  }

  async getAccessToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);

    this.setupTokenListener();
    this.oauth2Client.setCredentials(tokens);

    this.storeCredentials(tokens, tokens.refresh_token);

    return { error: false };
  }

  async refreshAccessToken() {
    const responseFilePath = join(cwd(), 'yt-oauth.json');

    if (!fs.existsSync(responseFilePath)) {
      return { error: true };
    }

    const authJson = fs.readFileSync(responseFilePath).toString();
    const auth = JSON.parse(authJson);

    this.setupTokenListener();
    this.oauth2Client.setCredentials({
      refresh_token: auth.refresh_token
    });
    this.storeCredentials(auth, auth.refresh_token);

    return { error: false };
  }

  storeCredentials(data: any, refreshToken: string) {

    console.log('tokens stored');

    fs.writeFileSync(
      join(cwd(), 'yt-oauth.json'),
      JSON.stringify({ ...data, refresh_token: refreshToken }, null, 2)
    );
  }

  setupTokenListener() {
    this.oauth2Client.on('tokens', (tokens) => {
      const responseFilePath = join(cwd(), 'yt-oauth.json');
      let refresh_token = '';

      if (fs.existsSync(responseFilePath)) {
        let authJson = fs.readFileSync(responseFilePath).toString();
        let auth = JSON.parse(authJson);
        refresh_token = auth.refresh_token;
      }
      
      if (tokens.refresh_token) {
        refresh_token = tokens.refresh_token;
      }
      
      console.log('tokens refreshed from client');
      this.storeCredentials(tokens, refresh_token);
    });
  }
}
