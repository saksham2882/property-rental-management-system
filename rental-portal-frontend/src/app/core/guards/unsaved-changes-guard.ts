import { CanDeactivateFn } from '@angular/router';

export interface PendingChanges {
  hasUnsavedChanges(): boolean;
}

export const confirmLeaveGuard: CanDeactivateFn<any> = (component) => {
  if (component && typeof component.hasUnsavedChanges === 'function' && component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Are you sure you want to leave this page?');
  }
  return true;
};
