import { Inject, Injectable } from '@angular/core';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ENVIRONMENT, EnvironmentConfig } from '@streamkit/youtube/shared/environment';

@Injectable({
  providedIn: 'root',
})
export class GifSearchService {
  private gifSearch = new GiphyFetch(this.environment.giphyApiKey);

  search(searchTerms: string) {
    return from(this.gifSearch.search(searchTerms)).pipe(
      map((results) => results.data[0]),
      map((gif) => gif.images.fixed_height.url),
      catchError(() => of(''))
    );
  }

  constructor(@Inject(ENVIRONMENT) private environment: EnvironmentConfig) {}
}
