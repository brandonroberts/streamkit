import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import * as SubscriptionsFeature from './subscription.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      SubscriptionsFeature.subscriptionsFeatureKey,
      SubscriptionsFeature.reducer
    )
  ],
})
export class YoutubeSharedStateSubscriptionsModule {}
