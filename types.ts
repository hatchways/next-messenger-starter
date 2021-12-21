import { Socket } from 'socket.io-client';
import { Action } from './store/actions';
import { NextApiRequest } from 'next';

// User with online status (within Convo)
export type OtherUser = {
  id: number;
  online: boolean;
  photoUrl: string;
  username: string;
};

export type Message = {
  conversationId: number;
  id: number;
  senderId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type Conversation =
  | {
      id: number;
      latestMessageText: string;
      messages: Message[];
      otherUser: OtherUser;
    } // Real Convo
  | {
      id: undefined;
      messages: Message[];
      otherUser: OtherUser;
    }; // Fake Convo

export type User = {
  id?: number;
  email?: string;
  isFetching?: boolean;
  photoUrl?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  bio?: string;
  completedOnboarding?: boolean;
  receiveNotifications?: boolean;
  receiveUpdates?: boolean;
  createdAt?: string;
  updatedAt?: string;
  error?: string;
};

export type State = {
  activeConversation?: string;
  conversations?: Conversation[];
  user?: User;
};

export type Dispatch = (action: Action | Thunk) => Promise<void>;

export type Thunk = (
  dispatch: Dispatch,
  getState: () => State,
  socket: Socket
) => Promise<void>;

export type Reducer = (state: State | undefined, action: Action) => State;

export interface CustomRequest extends NextApiRequest {
  user: {
    id: number;
    username: string;
    email: string;
    photoUrl: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    country: string;
    bio: string;
    completedOnboarding: boolean;
    receiveNotifications: boolean;
    receiveUpdates: boolean;
  };
}

// Onboarding
type OnboardingFieldType = 'text' | 'multiline-text' | 'checkbox' | 'yes-no';

interface Field {
  name: string;
  label: string;
  type: OnboardingFieldType;
  required?: boolean;
  value?: any;
}

type OnboardingStep = Field[];

export type OnboardingSteps = OnboardingStep[];