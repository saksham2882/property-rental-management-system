import { createReducer, on } from '@ngrx/store';
import { ChatMessage } from '../../core/models/message-model';
import * as MessagesActions from './messages.actions';

export interface MessagesState {
  messages: ChatMessage[];
  receivedMessages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

export const initialState: MessagesState = {
  messages: [],
  receivedMessages: [],
  loading: false,
  error: null
};

export const messagesReducer = createReducer(
  initialState,
  on(
    MessagesActions.loadChatHistory,
    MessagesActions.sendMessage,
    MessagesActions.loadReceivedMessages,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),
  
  on(MessagesActions.loadChatHistorySuccess, (state, { messages }) => ({
    ...state,
    messages,
    loading: false
  })),
  
  on(MessagesActions.sendMessageSuccess, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    loading: false
  })),
  
  on(MessagesActions.loadReceivedMessagesSuccess, (state, { messages }) => ({
    ...state,
    receivedMessages: messages,
    loading: false
  })),
  
  on(
    MessagesActions.loadChatHistoryFailure,
    MessagesActions.sendMessageFailure,
    MessagesActions.loadReceivedMessagesFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
