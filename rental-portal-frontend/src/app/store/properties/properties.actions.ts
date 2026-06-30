import { createAction, props } from '@ngrx/store';
import { Property, PropertyFilter } from '../../core/models/property-model';

export const loadProperties = createAction(
  '[Properties] Load Properties',
  props<{ filters?: PropertyFilter }>()
);

export const loadPropertiesSuccess = createAction(
  '[Properties] Load Properties Success',
  props<{ properties: Property[] }>()
);

export const loadPropertiesFailure = createAction(
  '[Properties] Load Properties Failure',
  props<{ error: string }>()
);

export const loadPropertyById = createAction(
  '[Properties] Load Property By Id',
  props<{ id: string }>()
);

export const loadPropertyByIdSuccess = createAction(
  '[Properties] Load Property By Id Success',
  props<{ property: Property }>()
);

export const loadPropertyByIdFailure = createAction(
  '[Properties] Load Property By Id Failure',
  props<{ error: string }>()
);

export const createProperty = createAction(
  '[Properties] Create Property',
  props<{ property: Partial<Property> }>()
);

export const createPropertySuccess = createAction(
  '[Properties] Create Property Success',
  props<{ property: Property }>()
);

export const createPropertyFailure = createAction(
  '[Properties] Create Property Failure',
  props<{ error: string }>()
);

export const updateProperty = createAction(
  '[Properties] Update Property',
  props<{ id: string; data: Partial<Property> }>()
);

export const updatePropertySuccess = createAction(
  '[Properties] Update Property Success',
  props<{ property: Property }>()
);

export const updatePropertyFailure = createAction(
  '[Properties] Update Property Failure',
  props<{ error: string }>()
);

export const deleteProperty = createAction(
  '[Properties] Delete Property',
  props<{ id: string }>()
);

export const deletePropertySuccess = createAction(
  '[Properties] Delete Property Success',
  props<{ id: string }>()
);

export const deletePropertyFailure = createAction(
  '[Properties] Delete Property Failure',
  props<{ error: string }>()
);

export const loadReviews = createAction(
  '[Properties] Load Reviews',
  props<{ propertyId: string }>()
);

export const loadReviewsSuccess = createAction(
  '[Properties] Load Reviews Success',
  props<{ reviews: any[] }>()
);

export const loadReviewsFailure = createAction(
  '[Properties] Load Reviews Failure',
  props<{ error: string }>()
);

export const addReview = createAction(
  '[Properties] Add Review',
  props<{ propertyId: string; review: any }>()
);

export const addReviewSuccess = createAction(
  '[Properties] Add Review Success',
  props<{ review: any }>()
);

export const addReviewFailure = createAction(
  '[Properties] Add Review Failure',
  props<{ error: string }>()
);
