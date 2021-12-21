import axios, { AxiosError } from 'axios';
import { Socket } from 'socket.io-client';
import { Message, OtherUser, User } from '../../types';
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
} from '../conversations';
import { gotUser, setFetchingStatus } from '../user';
import { Thunk } from '../../types';

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem('messenger-token');
  config.headers['x-access-token'] = token;

  return config;
});

const isAxiosError = (error: Error): error is AxiosError => {
  return (error as AxiosError).isAxiosError !== undefined;
};

// USER THUNK CREATORS
type ThunkCreator<T = undefined> = (arg: T) => Thunk;

export const fetchUser: ThunkCreator = () => async (dispatch, _, socket) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get('/api/auth/user');
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit('go-online', data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register: ThunkCreator<{
  username: string;
  email: string;
  password: string;
}> = (credentials) => async (dispatch, _, socket) => {
  try {
    const { data } = await axios.post('/api/auth/register', credentials);
    await localStorage.setItem('messenger-token', data.token);
    dispatch(gotUser(data));
    socket.emit('go-online', data.id);
  } catch (error) {
    if (error instanceof Error) {
      if (isAxiosError(error)) {
        dispatch(gotUser({ error: error.response?.data.error }));
      } else {
        dispatch(gotUser({ error: 'Server Error' }));
      }
    }

    console.error(error);
  }
};

export const login: ThunkCreator<{ username: string; password: string }> =
  (credentials) => async (dispatch, _, socket) => {
    try {
      const { data } = await axios.post('/api/auth/login', credentials);
      await localStorage.setItem('messenger-token', data.token);
      dispatch(gotUser(data));
      socket.emit('go-online', data.id);
    } catch (error) {
      if (error instanceof Error) {
        if (isAxiosError(error)) {
          dispatch(gotUser({ error: error.response?.data.error }));
        } else {
          dispatch(gotUser({ error: 'Server Error' }));
        }
      }

      console.error(error);
    }
  };

export const logout: ThunkCreator<number> =
  (id) => async (dispatch, _, socket) => {
    try {
      await axios.delete('/api/auth/logout');
      await localStorage.removeItem('messenger-token');
      dispatch(gotUser({}));
      socket.emit('logout', id);
    } catch (error) {
      console.error(error);
    }
  };

// CONVERSATIONS THUNK CREATORS

export const fetchConversations: ThunkCreator = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/conversations');
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body: {
  text: string;
  recipientId: number;
  conversationId: number | null;
  sender: User | null;
}) => {
  const { data } = await axios.post('/api/messages', body);
  return data;
};

const sendMessage = (
  data: { message: Message; sender: OtherUser },
  body: {
    text: string;
    recipientId: number;
    conversationId: number | null;
    sender: User | null;
  },
  socket: Socket
) => {
  socket.emit('new-message', {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage: ThunkCreator<{
  text: string;
  recipientId: number;
  conversationId: number | null;
  sender: User | null;
}> = (body) => async (dispatch, _, socket) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message, null));
    }

    sendMessage(data, body, socket);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers: ThunkCreator<string> =
  (searchTerm) => async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/users/${searchTerm}`);
      dispatch(setSearchedUsers(data));
    } catch (error) {
      console.error(error);
    }
  };
