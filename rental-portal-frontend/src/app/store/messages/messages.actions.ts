import { createAction, props } from '@ngrx/store';
import { ChatMessage } from '../../core/models/message-model';

export const loadChatHistory = createAction(
  '[Messages] Load Chat History',
  props<{ user1: string; user2: string }>()
);

export const loadChatHistorySuccess = createAction(
  '[Messages] Load Chat History Success',
  props<{ messages: ChatMessage[] }>()
);

export const loadChatHistoryFailure = createAction(
  '[Messages] Load Chat History Failure',
  props<{ error: string }>()
);

export const sendMessage = createAction(
  '[Messages] Send Message',
  props<{ message: ChatMessage }>()
);

export const sendMessageSuccess = createAction(
  '[Messages] Send Message Success',
  props<{ message: ChatMessage }>()
);

export const sendMessageFailure = createAction(
  '[Messages] Send Message Failure',
  props<{ error: string }>()
);

export const loadReceivedMessages = createAction(
  '[Messages] Load Received Messages',
  props<{ receiverId: string }>()
);

export const loadReceivedMessagesSuccess = createAction(
  '[Messages] Load Received Messages Success',
  props<{ messages: ChatMessage[] }>()
);

export const loadReceivedMessagesFailure = createAction(
  '[Messages] Load Received Messages Failure',
  props<{ error: string }>()
);
