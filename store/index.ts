import { RootAction } from './actions';
import { activeConvoReducer } from './activeConversation';
import { convoReducer } from './conversations';
import { userReducer } from './user';
import useThunkReducer from './utils/useThunkReducer';
import { Reducer } from '../types';

// Initial state

const initialState = {
  user: {
    isFetching: true,
  },
};

// ACTION CREATOR

export const clearOnLogout = (): RootAction => {
  return {
    type: 'CLEAR_ON_LOGOUT',
  };
};

// COMBINE REDUCER

const appReducer: Reducer = (state = {}, action) => {
  const reducers = {
    conversations: convoReducer(state.conversations, action),
    activeConversation: activeConvoReducer(state.activeConversation, action),
    user: userReducer(state.user, action),
  };

  return reducers;
};

const rootReducer: Reducer = (state = {}, action) => {
  if (action.type === 'CLEAR_ON_LOGOUT') {
    // set state to initial state
    state = {};
  }
  return appReducer(state, action);
};

// USE CONTEXT

export const useStore = () => {
  const [state, dispatch] = useThunkReducer(rootReducer, initialState);
  return {
    state,
    dispatch,
  };
};
