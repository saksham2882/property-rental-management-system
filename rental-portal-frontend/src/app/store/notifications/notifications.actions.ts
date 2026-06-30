import { createAction, props } from '@ngrx/store';
import { Notification } from '../../core/models/notification-model';

export const loadNotifications = createAction(
  '[Notifications] Load Notifications',
  props<{ userId?: string }>()
);

export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Notifications Success',
  props<{ notifications: Notification[] }>()
);

export const loadNotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: string }>()
);

export const markAsRead = createAction(
  '[Notifications] Mark As Read',
  props<{ id: string }>()
);

export const markAsReadSuccess = createAction(
  '[Notifications] Mark As Read Success',
  props<{ notification: Notification }>()
);

export const markAsReadFailure = createAction(
  '[Notifications] Mark As Read Failure',
  props<{ error: string }>()
);

export const createNotification = createAction(
  '[Notifications] Create Notification',
  props<{ notification: Partial<Notification> }>()
);

export const createNotificationSuccess = createAction(
  '[Notifications] Create Notification Success',
  props<{ notification: Notification }>()
);

export const createNotificationFailure = createAction(
  '[Notifications] Create Notification Failure',
  props<{ error: string }>()
);
