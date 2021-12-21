import React, { useState } from 'react';
import { Sidebar } from './index';
import { searchUsers } from '../../store/utils/thunkCreators';
import { clearSearchedUsers } from '../../store/conversations';
import { Conversation, Dispatch, User } from '../../types';

type SidebarContainerProps = {
  conversations?: Conversation[];
  user?: User;
  dispatch: Dispatch;
};

const SidebarContainer = ({
  conversations,
  user,
  dispatch,
}: SidebarContainerProps): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = async (event) => {
    if (event.target.value === '') {
      // clear searched convos from store
      dispatch(clearSearchedUsers());
      setSearchTerm('');
      return;
    }
    if (searchTerm.includes(event.target.value)) {
      // if new value is included in search term, we don't need to make another API call, just need to set the search term value so the conversations can be filtered in the rendering
      setSearchTerm(event.target.value);
      return;
    }
    await dispatch(searchUsers(event.target.value));
    setSearchTerm(event.target.value);
  };

  return (
    <Sidebar
      handleChange={handleChange}
      searchTerm={searchTerm}
      conversations={conversations}
      user={user}
      dispatch={dispatch}
    />
  );
};

export default SidebarContainer;
