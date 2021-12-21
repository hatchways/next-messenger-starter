import React from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { setActiveChat } from '../../store/activeConversation';
import { Conversation, Dispatch } from '../../types';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
}));

type ChatProps = {
  conversation: Conversation;
  dispatch: Dispatch;
};

const Chat = ({ conversation, dispatch }: ChatProps): React.ReactElement => {
  const classes = useStyles();
  const { otherUser } = conversation;

  const handleClick = async (conversation: Conversation) => {
    await dispatch(setActiveChat(conversation.otherUser.username));
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
};

export default Chat;
