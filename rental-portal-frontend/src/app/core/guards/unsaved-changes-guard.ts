import { CanDeactivateFn } from '@angular/router';

export interface PendingChanges {
  hasUnsavedChanges(): boolean;
}

export const confirmLeaveGuard: CanDeactivateFn<PendingChanges> = (component) => {
  if (component?.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Are you sure you want to leave this page?');
  }
  return true;
};
