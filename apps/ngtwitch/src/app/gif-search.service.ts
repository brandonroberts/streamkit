import { Injectable } from '@angular/core';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class GifSearchService {
  private apiConfig = this.appConfigService.get();
  private gifSearch = new GiphyFetch(this.apiConfig.giphyApiKey);

  constructor(
    private appConfigService: AppConfigService
  ) { }

  search(searchTerms: string) {
    return from(this.gifSearch.search(searchTerms)).pipe(
      map(results => results.data[0]),
      map(gif => gif.images.fixed_height.url),
      catchError(() => of(''))
    );
  }
}
