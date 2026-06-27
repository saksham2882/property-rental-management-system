import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessagesState } from './messages.reducer';

export const selectMessagesState = createFeatureSelector<MessagesState>('messages');

export const selectAllChatMessages = createSelector(
  selectMessagesState,
  (state) => state.messages
);

export const selectReceivedMessages = createSelector(
  selectMessagesState,
  (state) => state.receivedMessages
);

export const selectMessagesLoading = createSelector(
  selectMessagesState,
  (state) => state.loading
);

export const selectMessagesError = createSelector(
  selectMessagesState,
  (state) => state.error
);
