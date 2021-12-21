import { Action, ActiveConversationAction } from './actions';

// ACTION CREATORS

export const setActiveChat = (username: string): ActiveConversationAction => {
  return {
    type: 'SET_ACTIVE_CHAT',
    username,
  };
};

// REDUCER

export const activeConvoReducer = (
  state: string = '',
  action: Action
): string => {
  switch (action.type) {
    case 'SET_ACTIVE_CHAT': {
      return action.username;
    }
    default:
      return state;
  }
};
