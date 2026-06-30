import { createReducer, on } from '@ngrx/store';
import { Notification } from '../../core/models/notification-model';
import * as NotificationsActions from './notifications.actions';

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

export const notificationsReducer = createReducer(
  initialState,
  on(
    NotificationsActions.loadNotifications,
    NotificationsActions.markAsRead,
    NotificationsActions.createNotification,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),
  
  on(NotificationsActions.loadNotificationsSuccess, (state, { notifications }) => ({
    ...state,
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    loading: false
  })),
  
  on(NotificationsActions.markAsReadSuccess, (state, { notification }) => {
    const updatedList = state.notifications.map((n) => (n.id === notification.id ? notification : n));
    return {
      ...state,
      notifications: updatedList,
      unreadCount: updatedList.filter((n) => !n.isRead).length,
      loading: false
    };
  }),
  
  on(NotificationsActions.createNotificationSuccess, (state, { notification }) => {
    const updatedList = [notification, ...state.notifications];
    return {
      ...state,
      notifications: updatedList,
      unreadCount: updatedList.filter((n) => !n.isRead).length,
      loading: false
    };
  }),
  
  on(
    NotificationsActions.loadNotificationsFailure,
    NotificationsActions.markAsReadFailure,
    NotificationsActions.createNotificationFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
