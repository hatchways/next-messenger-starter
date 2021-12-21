import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Input, Header, Messages } from './index';
import { Conversation, Dispatch, User } from '../../types';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 8,
    flexDirection: 'column',
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
}));

type ActiveChatProps = {
  conversations?: Conversation[];
  activeConversation?: string;
  user?: User;
  dispatch: Dispatch;
};

const ActiveChat = ({
  user,
  conversations,
  activeConversation,
  dispatch,
}: ActiveChatProps): React.ReactElement => {
  const classes = useStyles();

  const conversation: Conversation | {} | undefined = conversations
    ? conversations.find(
        (conversation) => conversation.otherUser.username === activeConversation
      )
    : {};

  const isConversation = (obj: any): obj is Conversation => {
    return obj !== {} && obj !== undefined;
  };

  return (
    <Box className={classes.root}>
      {isConversation(conversation) && conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            {user && (
              <>
                <Messages
                  messages={conversation.messages}
                  otherUser={conversation.otherUser}
                  userId={user.id}
                />
                <Input
                  otherUser={conversation.otherUser}
                  conversationId={conversation.id || null}
                  user={user}
                  dispatch={dispatch}
                />
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
