import { Injectable, Injector } from '@angular/core';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class GifSearchService {
  private _gifSearch: GiphyFetch;

  constructor(
    private injector: Injector
  ) { }

  get apiConfig() {
    return this.injector.get(AppConfigService).get();
  }

  get gifSearch() {
    if (!this._gifSearch) {
      this._gifSearch = new GiphyFetch(this.apiConfig.giphyApiKey);
    }

    return this._gifSearch;
  }

  search(searchTerms: string) {
    return from(this.gifSearch.search(searchTerms)).pipe(
      map(results => results.data[0]),
      map(gif => gif.images.fixed_height.url),
      catchError(() => of(''))
    );
  }
}
