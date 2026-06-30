import { createReducer, on } from '@ngrx/store';
import { Rent } from '../../core/models/rent-model';
import * as RentActions from './rent.actions';

export interface RentState {
  rents: Rent[];
  order: any;
  loading: boolean;
  error: string | null;
}

export const initialState: RentState = {
  rents: [],
  order: null,
  loading: false,
  error: null
};

export const rentReducer = createReducer(
  initialState,
  on(
    RentActions.loadRents,
    RentActions.markPaid,
    RentActions.initiateOrder,
    RentActions.verifyPayment,
    RentActions.createRent,
    RentActions.updateRent,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(RentActions.loadRentsSuccess, (state, { rents }) => ({
    ...state,
    rents,
    loading: false
  })),

  on(RentActions.markPaidSuccess, RentActions.verifyPaymentSuccess, RentActions.updateRentSuccess, (state, { rent }) => ({
    ...state,
    rents: state.rents.map((r) => (r.id === rent.id ? rent : r)),
    loading: false
  })),

  on(RentActions.initiateOrderSuccess, (state, { order }) => ({
    ...state,
    order,
    loading: false
  })),

  on(RentActions.createRentSuccess, (state, { rent }) => ({
    ...state,
    rents: [...state.rents, rent],
    loading: false
  })),
  
  on(
    RentActions.loadRentsFailure,
    RentActions.markPaidFailure,
    RentActions.initiateOrderFailure,
    RentActions.verifyPaymentFailure,
    RentActions.createRentFailure,
    RentActions.updateRentFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
