import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { propertiesReducer, PropertiesState } from './properties/properties.reducer';
import { applicationsReducer, ApplicationsState } from './applications/applications.reducer';
import { leasesReducer, LeasesState } from './leases/leases.reducer';
import { maintenanceReducer, MaintenanceState } from './maintenance/maintenance.reducer';
import { rentReducer, RentState } from './rent/rent.reducer';
import { messagesReducer, MessagesState } from './messages/messages.reducer';
import { notificationsReducer, NotificationsState } from './notifications/notifications.reducer';

import { AuthEffects } from './auth/auth.effects';
import { PropertiesEffects } from './properties/properties.effects';
import { ApplicationsEffects } from './applications/applications.effects';
import { LeasesEffects } from './leases/leases.effects';
import { MaintenanceEffects } from './maintenance/maintenance.effects';
import { RentEffects } from './rent/rent.effects';
import { MessagesEffects } from './messages/messages.effects';
import { NotificationsEffects } from './notifications/notifications.effects';

export interface AppState {
  auth: AuthState;
  properties: PropertiesState;
  applications: ApplicationsState;
  leases: LeasesState;
  maintenance: MaintenanceState;
  rent: RentState;
  messages: MessagesState;
  notifications: NotificationsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  properties: propertiesReducer,
  applications: applicationsReducer,
  leases: leasesReducer,
  maintenance: maintenanceReducer,
  rent: rentReducer,
  messages: messagesReducer,
  notifications: notificationsReducer
};

export const appEffects = [
  AuthEffects,
  PropertiesEffects,
  ApplicationsEffects,
  LeasesEffects,
  MaintenanceEffects,
  RentEffects,
  MessagesEffects,
  NotificationsEffects
];
