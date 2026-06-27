import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification-service';
import { ToastService } from '../../core/services/toast-service';
import * as NotificationsActions from './notifications.actions';

@Injectable()
export class NotificationsEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);
  private toast = inject(ToastService);
  private knownIds = new Set<string>();

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadNotifications),
      switchMap(({ userId }) => {
        const obs = userId 
          ? this.notificationService.getByUser(userId)
          : this.notificationService.getAll();
        return obs.pipe(
          map((notifications) => NotificationsActions.loadNotificationsSuccess({ notifications })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load notifications';
            return of(NotificationsActions.loadNotificationsFailure({ error }));
          })
        );
      })
    )
  );

  showNotificationToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.loadNotificationsSuccess),
        tap(({ notifications }) => {
          notifications.forEach((n) => {
            if (!n.isRead && n.id && !this.knownIds.has(String(n.id))) {
              if (this.knownIds.size > 0) {
                this.toast.info(n.message);
              }
              this.knownIds.add(String(n.id));
            }
          });

          if (this.knownIds.size === 0) {
            notifications.forEach((n) => {
              if (n.id) this.knownIds.add(String(n.id));
            });
          }
        })
      ),
    { dispatch: false }
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markAsRead),
      switchMap(({ id }) =>
        this.notificationService.markAsRead(id).pipe(
          map((updated) => NotificationsActions.markAsReadSuccess({ notification: updated })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to mark notification as read';
            return of(NotificationsActions.markAsReadFailure({ error }));
          })
        )
      )
    )
  );

  createNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.createNotification),
      switchMap(({ notification }) =>
        this.notificationService.create(notification).pipe(
          map((created) => NotificationsActions.createNotificationSuccess({ notification: created })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to trigger notification';
            return of(NotificationsActions.createNotificationFailure({ error }));
          })
        )
      )
    )
  );
}
