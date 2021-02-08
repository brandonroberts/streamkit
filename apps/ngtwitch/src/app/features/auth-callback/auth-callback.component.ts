import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, tap } from 'rxjs/operators';

import { AppConfigService } from '../../app-config.service';
import { AuthActions } from '../../shared/state/auth';

@Component({
  selector: 'ngtwitch-auth-callback',
  template: ``
})
export class AuthCallbackComponent implements OnInit {
  private apiConfig = this.appConfigService.get();

  constructor(
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.route.fragment.pipe(
      tap(hash => {
        const access_token_string = hash.split('&')[0];
        const token = access_token_string.replace('access_token=', '');
        const clientId = this.apiConfig.twitchClientId;

        this.store.dispatch(AuthActions.authCallbackEnter({ token, clientId }));
      }),
      first()
    ).subscribe();
  }

}
