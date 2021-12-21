import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
} from '@material-ui/core';
import { useStore } from '../store';
import { login } from '../store/utils/thunkCreators';

const Login = () => {
  const router = useRouter();

  const {
    state: { user },
    dispatch,
  } = useStore();

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      username: HTMLInputElement;
      password: HTMLInputElement;
    };
    const username = formElements.username.value;
    const password = formElements.password.value;

    await dispatch(login({ username, password }));
  };

  useEffect(() => {
    if (user && user.id) router.push('/home');
  }, [user]);

  return (
    <Grid container justifyContent="center">
      <Box>
        <Grid container item>
          <Typography>Need to register?</Typography>
          <Link href="/register">
            <Button>
              <a>Register</a>
            </Button>
          </Link>
        </Grid>
        <form onSubmit={handleLogin}>
          <Grid>
            <Grid>
              <FormControl margin="normal" required>
                <TextField
                  aria-label="username"
                  label="Username"
                  name="username"
                  type="text"
                />
              </FormControl>
            </Grid>
            <FormControl margin="normal" required>
              <TextField
                label="password"
                aria-label="password"
                type="password"
                name="password"
              />
            </FormControl>
            <Grid>
              <Button type="submit" variant="contained" size="large">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Grid>
  );
};

export default dynamic(() => Promise.resolve(Login), { ssr: false });
