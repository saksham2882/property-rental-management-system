import { CanDeactivateFn } from '@angular/router';

export interface PendingChanges {
  hasUnsavedChanges(): boolean;
}

export const confirmLeaveGuard: CanDeactivateFn<any> = (component) => {
  if (component && component.hasUnsavedChanges() && typeof component.hasUnsavedChanges === 'function') {
    return confirm('You have unsaved changes. Are you sure you want to leave this page?');
  }
  return true;
};
