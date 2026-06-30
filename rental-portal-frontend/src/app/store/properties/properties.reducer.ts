import { createReducer, on } from '@ngrx/store';
import { Property, PropertyFilter } from '../../core/models/property-model';
import * as PropertiesActions from './properties.actions';

export interface PropertiesState {
  properties: Property[];
  selectedProperty: Property | null;
  reviews: any[];
  loading: boolean;
  error: string | null;
  filters: PropertyFilter | null;
}

export const initialState: PropertiesState = {
  properties: [],
  selectedProperty: null,
  reviews: [],
  loading: false,
  error: null,
  filters: null
};

export const propertiesReducer = createReducer(
  initialState,
  on(
    PropertiesActions.loadProperties,
    PropertiesActions.loadPropertyById,
    PropertiesActions.createProperty,
    PropertiesActions.updateProperty,
    PropertiesActions.deleteProperty,
    PropertiesActions.loadReviews,
    PropertiesActions.addReview,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(PropertiesActions.loadPropertiesSuccess, (state, { properties }) => ({
    ...state,
    properties,
    loading: false
  })),
  
  on(PropertiesActions.loadPropertyByIdSuccess, (state, { property }) => ({
    ...state,
    selectedProperty: property,
    loading: false
  })),
  
  on(PropertiesActions.createPropertySuccess, (state, { property }) => ({
    ...state,
    properties: [...state.properties, property],
    loading: false
  })),
  
  on(PropertiesActions.updatePropertySuccess, (state, { property }) => ({
    ...state,
    properties: state.properties.map((p) => (p.id === property.id ? property : p)),
    selectedProperty: state.selectedProperty?.id === property.id ? property : state.selectedProperty,
    loading: false
  })),
  
  on(PropertiesActions.deletePropertySuccess, (state, { id }) => ({
    ...state,
    properties: state.properties.filter((p) => p.id !== id),
    selectedProperty: state.selectedProperty?.id === id ? null : state.selectedProperty,
    loading: false
  })),
  
  on(PropertiesActions.loadReviewsSuccess, (state, { reviews }) => ({
    ...state,
    reviews,
    loading: false
  })),
  
  on(PropertiesActions.addReviewSuccess, (state, { review }) => ({
    ...state,
    reviews: [...state.reviews, review],
    loading: false
  })),
  
  on(
    PropertiesActions.loadPropertiesFailure,
    PropertiesActions.loadPropertyByIdFailure,
    PropertiesActions.createPropertyFailure,
    PropertiesActions.updatePropertyFailure,
    PropertiesActions.deletePropertyFailure,
    PropertiesActions.loadReviewsFailure,
    PropertiesActions.addReviewFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
