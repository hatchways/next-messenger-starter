import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';
import { OtherUser, Message } from '../../types';

type MessagesProps = {
  messages: Message[];
  otherUser: OtherUser;
  userId: number | undefined;
};

const Messages = ({
  messages,
  otherUser,
  userId,
}: MessagesProps): React.ReactElement => {
  return (
    <Box>
      {messages.map((message) => {
        const time: string = moment(message.createdAt).format('h:mm');

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
