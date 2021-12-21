import { Conversation, Message, OtherUser, User } from '../types';

export type ActiveConversationAction = {
  type: 'SET_ACTIVE_CHAT';
  username: string;
};

export type ConversationAction =
  | {
      type: 'GET_CONVERSATIONS';
      conversations: Conversation[];
    }
  | {
      type: 'SET_MESSAGE';
      payload: {
        message: Message;
        sender: OtherUser | null;
      };
    }
  | {
      type: 'ADD_ONLINE_USER';
      id: number;
    }
  | {
      type: 'REMOVE_OFFLINE_USER';
      id: number;
    }
  | {
      type: 'SET_SEARCHED_USERS';
      users: OtherUser[];
    }
  | {
      type: 'CLEAR_SEARCHED_USERS';
    }
  | {
      type: 'ADD_CONVERSATION';
      payload: {
        recipientId: number;
        newMessage: Message;
      };
    };

export type UserAction =
  | {
      type: 'GET_USER';
      payload: User;
    }
  | {
      type: 'SET_FETCHING_STATUS';
      isFetching: boolean;
    };

export type RootAction = {
  type: 'CLEAR_ON_LOGOUT';
};

export type Action =
  | ConversationAction
  | ActiveConversationAction
  | UserAction
  | RootAction;
