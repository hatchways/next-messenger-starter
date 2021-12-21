import { User } from '../types';
import { Action, UserAction } from './actions';

// ACTION CREATORS

export const gotUser = (payload: User): UserAction => {
  return {
    type: 'GET_USER',
    payload,
  };
};

export const setFetchingStatus = (isFetching: boolean): UserAction => ({
  type: 'SET_FETCHING_STATUS',
  isFetching,
});

// REDUCER

export const userReducer = (
  state: User = { isFetching: true },
  action: Action
): User => {
  switch (action.type) {
    case 'GET_USER':
      return action.payload;
    case 'SET_FETCHING_STATUS':
      return {
        ...state,
        isFetching: action.isFetching,
      };
    default:
      return state;
  }
};
