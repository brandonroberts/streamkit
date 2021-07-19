import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { GitHubEffects } from './alerts.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      GitHubEffects
    ])
  ]
})
export class GithubSharedStateAlertsModule {}
