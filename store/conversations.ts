import { Conversation, Message, OtherUser } from '../types';
import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
} from './utils/reducerFunctions';
import { Action, ConversationAction } from './actions';

// ACTION CREATORS

export const gotConversations = (
  conversations: Conversation[]
): ConversationAction => {
  return {
    type: 'GET_CONVERSATIONS',
    conversations,
  };
};

export const setNewMessage = (
  message: Message,
  sender: OtherUser | null
): ConversationAction => {
  return {
    type: 'SET_MESSAGE',
    payload: { message, sender: sender || null },
  };
};

export const addOnlineUser = (id: number): ConversationAction => {
  return {
    type: 'ADD_ONLINE_USER',
    id,
  };
};

export const removeOfflineUser = (id: number): ConversationAction => {
  return {
    type: 'REMOVE_OFFLINE_USER',
    id,
  };
};

export const setSearchedUsers = (users: OtherUser[]): ConversationAction => {
  return {
    type: 'SET_SEARCHED_USERS',
    users,
  };
};

export const clearSearchedUsers = (): ConversationAction => {
  return {
    type: 'CLEAR_SEARCHED_USERS',
  };
};

// add new conversation when sending a new message
export const addConversation = (
  recipientId: number,
  newMessage: Message
): ConversationAction => {
  return {
    type: 'ADD_CONVERSATION',
    payload: { recipientId, newMessage },
  };
};

// REDUCER

export const convoReducer = (
  state: Conversation[] = [],
  action: Action
): Conversation[] => {
  switch (action.type) {
    case 'GET_CONVERSATIONS':
      return action.conversations;
    case 'SET_MESSAGE':
      return addMessageToStore(state, action.payload);
    case 'ADD_ONLINE_USER': {
      return addOnlineUserToStore(state, action.id);
    }
    case 'REMOVE_OFFLINE_USER': {
      return removeOfflineUserFromStore(state, action.id);
    }
    case 'SET_SEARCHED_USERS':
      return addSearchedUsersToStore(state, action.users);
    case 'CLEAR_SEARCHED_USERS':
      return state.filter((convo) => convo.id);
    case 'ADD_CONVERSATION':
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );
    default:
      return state;
  }
};
