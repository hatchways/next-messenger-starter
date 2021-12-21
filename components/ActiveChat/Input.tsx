import React, { useState } from 'react';
import { FormControl, FilledInput } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { postMessage } from '../../store/utils/thunkCreators';
import { OtherUser, Dispatch, User } from '../../types';

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: 'flex-end',
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: '#F4F6FA',
    borderRadius: 8,
    marginBottom: 20,
  },
}));

type InputProps = {
  otherUser: OtherUser;
  conversationId: number | null;
  user: User;
  dispatch: Dispatch;
};

const Input = ({
  otherUser,
  conversationId,
  user,
  dispatch,
}: InputProps): React.ReactElement => {
  const classes = useStyles();
  const [text, setText] = useState('');

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setText(event.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      text: HTMLInputElement;
    };
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: formElements.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user,
    };
    await dispatch(postMessage(reqBody));
    setText('');
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

export default Input;
