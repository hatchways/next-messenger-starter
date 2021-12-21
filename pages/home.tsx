import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SidebarContainer } from '../components/Sidebar';
import { ActiveChat } from '../components/ActiveChat';
import {
  logout,
  fetchConversations,
  fetchUser,
} from '../store/utils/thunkCreators';
import { useStore, clearOnLogout } from '../store';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
}));

const Home = () => {
  const router = useRouter();

  const {
    state: { user, conversations, activeConversation },
    dispatch,
  } = useStore();

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) router.push('/login');
      else router.push('/register');
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchUser(undefined));
    dispatch(fetchConversations(undefined));
  }, [dispatch, fetchUser, fetchConversations]);

  const handleLogout = async () => {
    if (user && user.id) {
      await dispatch(logout(user.id));
    }
    await dispatch(clearOnLogout());
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          dispatch={dispatch}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          dispatch={dispatch}
        />
      </Grid>
    </>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
