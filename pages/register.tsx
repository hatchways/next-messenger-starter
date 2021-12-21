import React, { useState, useEffect } from 'react';
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
  FormHelperText,
} from '@material-ui/core';
import { useStore } from '../store';
import { register } from '../store/utils/thunkCreators';

const Register = () => {
  const router = useRouter();

  const {
    state: { user },
    dispatch,
  } = useStore();

  const [formErrorMessage, setFormErrorMessage] = useState<{
    confirmPassword?: string;
  }>({});

  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      username: HTMLInputElement;
      email: HTMLInputElement;
      password: HTMLInputElement;
      confirmPassword: HTMLInputElement;
    };
    const username = formElements.username.value;
    const email = formElements.email.value;
    const password = formElements.password.value;
    const confirmPassword = formElements.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: 'Passwords must match' });
      return;
    }
    await dispatch(register({ username, email, password }));
  };

  useEffect(() => {
    if (user && user.id) router.push('/home');
  }, [user]);

  return (
    <Grid container justifyContent="center">
      <Box>
        <Grid container item>
          <Typography>Need to log in?</Typography>
          <Link href="/login">
            <Button>
              <a>Login</a>
            </Button>
          </Link>
        </Grid>
        <form onSubmit={handleRegister}>
          <Grid>
            <Grid>
              <FormControl>
                <TextField
                  aria-label="username"
                  label="Username"
                  name="username"
                  type="text"
                  required
                />
              </FormControl>
            </Grid>
            <Grid>
              <FormControl>
                <TextField
                  label="E-mail address"
                  aria-label="e-mail address"
                  type="email"
                  name="email"
                  required
                />
              </FormControl>
            </Grid>
            <Grid>
              <FormControl error={!!formErrorMessage.confirmPassword}>
                <TextField
                  aria-label="password"
                  label="Password"
                  type="password"
                  inputProps={{ minLength: 6 }}
                  name="password"
                  required
                />
                <FormHelperText>
                  {formErrorMessage.confirmPassword}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl error={!!formErrorMessage.confirmPassword}>
                <TextField
                  label="Confirm Password"
                  aria-label="confirm password"
                  type="password"
                  inputProps={{ minLength: 6 }}
                  name="confirmPassword"
                  required
                />
                <FormHelperText>
                  {formErrorMessage.confirmPassword}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Button type="submit" variant="contained" size="large">
              Create
            </Button>
          </Grid>
        </form>
      </Box>
    </Grid>
  );
};

export default dynamic(() => Promise.resolve(Register), { ssr: false });
