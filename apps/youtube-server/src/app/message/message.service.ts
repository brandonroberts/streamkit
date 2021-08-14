import { Injectable } from '@nestjs/common';
import { MessageActions } from '@streamkit/shared/actions';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MessageService {
  _pinnedMessages$ = new ReplaySubject<string>(1);
  pinnedMessages$ = this._pinnedMessages$.pipe(
    map((id) => MessageActions.pinMessage({ id }))
  );

  pinMessage(id: string) {
    this._pinnedMessages$.next(id);
  }
}
