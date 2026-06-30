import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ChatService } from '../../core/services/message-service';
import * as MessagesActions from './messages.actions';

@Injectable()
export class MessagesEffects {
  private actions$ = inject(Actions);
  private chatService = inject(ChatService);

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadChatHistory),
      switchMap(({ user1, user2 }) =>
        this.chatService.getChatHistory(user1, user2).pipe(
          map((messages) => MessagesActions.loadChatHistorySuccess({ messages })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load chat history';
            return of(MessagesActions.loadChatHistoryFailure({ error }));
          })
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.sendMessage),
      switchMap(({ message }) =>
        this.chatService.sendMessage(message).pipe(
          map((sent) => MessagesActions.sendMessageSuccess({ message: sent })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to send message';
            return of(MessagesActions.sendMessageFailure({ error }));
          })
        )
      )
    )
  );

  loadReceived$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadReceivedMessages),
      switchMap(({ receiverId }) =>
        this.chatService.getReceivedMessages(receiverId).pipe(
          map((messages) => MessagesActions.loadReceivedMessagesSuccess({ messages })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load received messages';
            return of(MessagesActions.loadReceivedMessagesFailure({ error }));
          })
        )
      )
    )
  );
}
