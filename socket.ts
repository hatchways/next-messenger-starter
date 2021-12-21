import io, { Socket } from 'socket.io-client';
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from './store/conversations';
import { Dispatch } from './types';

export const createSocket = (dispatch: Dispatch): Socket => {
  const socket = io(window.location.origin);

  socket.on('connect', () => {
    console.log('connected to server');

    socket.on('add-online-user', (id) => {
      dispatch(addOnlineUser(id));
    });

    socket.on('remove-offline-user', (id) => {
      dispatch(removeOfflineUser(id));
    });
    socket.on('new-message', (data) => {
      dispatch(setNewMessage(data.message, data.sender));
    });
  });

  return socket;
};
