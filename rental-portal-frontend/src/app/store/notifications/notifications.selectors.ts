import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationsState } from './notifications.reducer';
import { selectCurrentUser } from '../auth/auth.selectors';

export const selectNotificationsState = createFeatureSelector<NotificationsState>('notifications');

export const selectAllNotifications = createSelector(
  selectNotificationsState,
  (state) => state.notifications
);

export const selectMyNotifications = createSelector(
  selectAllNotifications,
  selectCurrentUser,
  (notifications, currentUser) => {
    if (!currentUser) return [];
    return notifications.filter((n) => n.userId === currentUser.id);
  }
);

export const selectUnreadCount = createSelector(
  selectMyNotifications,
  (myNotifications) => {
    return myNotifications.filter((n) => !n.isRead).length;
  }
);

export const selectNotificationsLoading = createSelector(
  selectNotificationsState,
  (state) => state.loading
);

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state) => state.error
);
