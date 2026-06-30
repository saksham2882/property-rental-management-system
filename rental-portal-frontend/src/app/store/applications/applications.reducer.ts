import { createReducer, on } from '@ngrx/store';
import { RentalApplication } from '../../core/models/application-model';
import * as ApplicationsActions from './applications.actions';

export interface ApplicationsState {
  applications: RentalApplication[];
  loading: boolean;
  error: string | null;
}

export const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null
};

export const applicationsReducer = createReducer(
  initialState,
  on(
    ApplicationsActions.loadApplications,
    ApplicationsActions.submitApplication,
    ApplicationsActions.updateApplicationStatus,
    ApplicationsActions.deleteApplication,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(ApplicationsActions.loadApplicationsSuccess, (state, { applications }) => ({
    ...state,
    applications,
    loading: false
  })),

  on(ApplicationsActions.submitApplicationSuccess, (state, { application }) => ({
    ...state,
    applications: [...state.applications, application],
    loading: false
  })),

  on(ApplicationsActions.updateApplicationStatusSuccess, (state, { application }) => ({
    ...state,
    applications: state.applications.map((app) => (app.id === application.id ? application : app)),
    loading: false
  })),

  on(ApplicationsActions.deleteApplicationSuccess, (state, { id }) => ({
    ...state,
    applications: state.applications.filter((app) => app.id !== id),
    loading: false
  })),
  
  on(
    ApplicationsActions.loadApplicationsFailure,
    ApplicationsActions.submitApplicationFailure,
    ApplicationsActions.updateApplicationStatusFailure,
    ApplicationsActions.deleteApplicationFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
