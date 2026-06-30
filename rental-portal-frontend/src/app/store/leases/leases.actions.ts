import { createAction, props } from '@ngrx/store';
import { Lease } from '../../core/models/lease-model';

export const loadLeases = createAction(
  '[Leases] Load Leases',
  props<{ tenantId?: string }>()
);

export const loadLeasesSuccess = createAction(
  '[Leases] Load Leases Success',
  props<{ leases: Lease[] }>()
);

export const loadLeasesFailure = createAction(
  '[Leases] Load Leases Failure',
  props<{ error: string }>()
);

export const loadLeaseById = createAction(
  '[Leases] Load Lease By Id',
  props<{ id: string }>()
);

export const loadLeaseByIdSuccess = createAction(
  '[Leases] Load Lease By Id Success',
  props<{ lease: Lease }>()
);

export const loadLeaseByIdFailure = createAction(
  '[Leases] Load Lease By Id Failure',
  props<{ error: string }>()
);

export const createLease = createAction(
  '[Leases] Create Lease',
  props<{ lease: Partial<Lease> }>()
);

export const createLeaseSuccess = createAction(
  '[Leases] Create Lease Success',
  props<{ lease: Lease }>()
);

export const createLeaseFailure = createAction(
  '[Leases] Create Lease Failure',
  props<{ error: string }>()
);

export const signLease = createAction(
  '[Leases] Sign Lease',
  props<{ id: string; signatureImage: string }>()
);

export const signLeaseSuccess = createAction(
  '[Leases] Sign Lease Success',
  props<{ lease: Lease }>()
);

export const signLeaseFailure = createAction(
  '[Leases] Sign Lease Failure',
  props<{ error: string }>()
);
