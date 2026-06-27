import { createAction, props } from '@ngrx/store';
import { Rent } from '../../core/models/rent-model';

export const loadRents = createAction(
  '[Rent] Load Rents',
  props<{ tenantId?: string; status?: string }>()
);

export const loadRentsSuccess = createAction(
  '[Rent] Load Rents Success',
  props<{ rents: Rent[] }>()
);

export const loadRentsFailure = createAction(
  '[Rent] Load Rents Failure',
  props<{ error: string }>()
);

export const markPaid = createAction(
  '[Rent] Mark Paid',
  props<{ id: string }>()
);

export const markPaidSuccess = createAction(
  '[Rent] Mark Paid Success',
  props<{ rent: Rent }>()
);

export const markPaidFailure = createAction(
  '[Rent] Mark Paid Failure',
  props<{ error: string }>()
);

export const initiateOrder = createAction(
  '[Rent] Initiate Order',
  props<{ id: string }>()
);

export const initiateOrderSuccess = createAction(
  '[Rent] Initiate Order Success',
  props<{ order: any }>()
);

export const initiateOrderFailure = createAction(
  '[Rent] Initiate Order Failure',
  props<{ error: string }>()
);

export const verifyPayment = createAction(
  '[Rent] Verify Payment',
  props<{ id: string; payload: any }>()
);

export const verifyPaymentSuccess = createAction(
  '[Rent] Verify Payment Success',
  props<{ rent: Rent }>()
);

export const verifyPaymentFailure = createAction(
  '[Rent] Verify Payment Failure',
  props<{ error: string }>()
);

export const createRent = createAction(
  '[Rent] Create Rent',
  props<{ rent: Partial<Rent> }>()
);

export const createRentSuccess = createAction(
  '[Rent] Create Rent Success',
  props<{ rent: Rent }>()
);

export const createRentFailure = createAction(
  '[Rent] Create Rent Failure',
  props<{ error: string }>()
);

export const updateRent = createAction(
  '[Rent] Update Rent',
  props<{ id: string; data: Partial<Rent> }>()
);

export const updateRentSuccess = createAction(
  '[Rent] Update Rent Success',
  props<{ rent: Rent }>()
);

export const updateRentFailure = createAction(
  '[Rent] Update Rent Failure',
  props<{ error: string }>()
);
