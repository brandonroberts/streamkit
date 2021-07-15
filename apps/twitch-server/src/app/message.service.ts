import { Injectable } from '@nestjs/common';
import { MessageActions } from '@streamkit/actions';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MessageService {
  _pinnedMessages$ = new Subject<string>();
  pinnedMessages$ = this._pinnedMessages$.pipe(
    map((id) => MessageActions.pinMessage({ id }))
  );

  pinMessage(id: string) {
    this._pinnedMessages$.next(id);
  }
}
