import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EnvironmentConfig {
  wsToken: string;
  wsHost: string;
  giphyApiKey: string;
}

export const ENVIRONMENT = new InjectionToken<EnvironmentConfig>('Environment Config');

@NgModule({
  imports: [CommonModule],
})
export class YoutubeSharedEnvironmentModule {
  static forRoot(config: Partial<EnvironmentConfig>): ModuleWithProviders<YoutubeSharedEnvironmentModule> {
    return {
      ngModule: YoutubeSharedEnvironmentModule,
      providers: [
        { provide: ENVIRONMENT, useValue: config }
      ]
    };
  }
}
