import { Injectable, InjectionToken, Inject } from '@angular/core';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { environment } from 'src/environments/environment';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const GIPHY_SEARCH = new InjectionToken<GiphyFetch>('Giphy Search', {
  factory: () => {
    return new GiphyFetch(environment.giphyApiKey);
  }
})

@Injectable({
  providedIn: 'root'
})
export class GifSearchService {
  constructor(@Inject(GIPHY_SEARCH) private gifSearch: GiphyFetch) { }

  search(searchTerms: string) {
    return from(this.gifSearch.search(searchTerms)).pipe(
      map(results => results.data[0]),
      map(gif => gif.images.fixed_height.url),
      catchError(() => of(''))
    );
  }
}
