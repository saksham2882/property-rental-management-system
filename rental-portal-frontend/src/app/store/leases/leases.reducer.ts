import { createReducer, on } from '@ngrx/store';
import { Lease } from '../../core/models/lease-model';
import * as LeasesActions from './leases.actions';

export interface LeasesState {
  leases: Lease[];
  selectedLease: Lease | null;
  loading: boolean;
  error: string | null;
}

export const initialState: LeasesState = {
  leases: [],
  selectedLease: null,
  loading: false,
  error: null
};

export const leasesReducer = createReducer(
  initialState,
  on(
    LeasesActions.loadLeases,
    LeasesActions.loadLeaseById,
    LeasesActions.createLease,
    LeasesActions.signLease,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(LeasesActions.loadLeasesSuccess, (state, { leases }) => ({
    ...state,
    leases,
    loading: false
  })),

  on(LeasesActions.loadLeaseByIdSuccess, (state, { lease }) => ({
    ...state,
    selectedLease: lease,
    loading: false
  })),

  on(LeasesActions.createLeaseSuccess, (state, { lease }) => ({
    ...state,
    leases: [...state.leases, lease],
    loading: false
  })),

  on(LeasesActions.signLeaseSuccess, (state, { lease }) => ({
    ...state,
    leases: state.leases.map((l) => (l.id === lease.id ? lease : l)),
    selectedLease: state.selectedLease?.id === lease.id ? lease : state.selectedLease,
    loading: false
  })),
  
  on(
    LeasesActions.loadLeasesFailure,
    LeasesActions.loadLeaseByIdFailure,
    LeasesActions.createLeaseFailure,
    LeasesActions.signLeaseFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
