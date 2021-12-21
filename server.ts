import express, { NextFunction, Request, Response } from 'express';
import next from 'next';
import { join } from 'path';
import logger from 'morgan';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import http from 'http';
import connect from 'connect-session-sequelize';
import db from './db';
import { User as UserModel } from './db/models';
import { Message, User } from './types';
import { PORT, NODE_ENV, SESSION_SECRET } from './env';
import { Socket } from 'socket.io';
const SequelizeStore = connect(session.Store);
const sessionStore = new SequelizeStore({ db });

interface CustomRequest extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    photoUrl: string;
    password: string;
    salt: string;
  };
}

interface HttpError extends Error {
  status: number;
  message: string;
}

const port = parseInt(PORT);
const dev = NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const { json, urlencoded } = express;
  const server = express();

  server.use(logger('dev'));
  server.use(json());
  server.use(urlencoded({ extended: false }));
  server.use(express.static(join(__dirname, 'public')));

  server.use((expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as CustomRequest;
    const token = req.headers['x-access-token'];
    if (token && typeof token === 'string') {
      jwt.verify(token, SESSION_SECRET, (err, decoded) => {
        if (err || decoded === undefined) {
          return next();
        }
        UserModel.findOne({
          where: { id: decoded.id },
        }).then((user) => {
          if (user) req.user = user;
          return next();
        });
      });
    } else {
      return next();
    }
  });

  // custom server use next js route handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = http.createServer(server);

  const io = require('socket.io')(httpServer);

  io.on('connection', (socket: Socket) => {
    socket.on('go-online', (id: number) => {
      // send the user who just went online to everyone else who is already online
      socket.broadcast.emit('add-online-user', id);
    });

    type data = {
      message: Message;
      recipientId: number;
      sender: User | null;
    };

    socket.on('new-message', (data: data) => {
      socket.broadcast.emit('new-message', {
        message: data.message,
        sender: data.sender,
      });
    });

    socket.on('logout', (id: number) => {
      socket.broadcast.emit('remove-offline-user', id);
    });
  });

  sessionStore.sync();

  httpServer.listen(port);
  httpServer.on('error', onError);
  httpServer.on('listening', () => {
    console.log('Listening on ' + port);
  });
});

db.sync();

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
