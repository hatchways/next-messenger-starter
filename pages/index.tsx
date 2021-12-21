import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useStore } from '../store';
import { fetchUser } from '../store/utils/thunkCreators';
import { SnackbarError } from '../components';

const Routes = () => {
  const router = useRouter();

  const {
    state: { user },
    dispatch,
  } = useStore();

  const [errorMessage, setErrorMessage] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUser(undefined));
  }, [dispatch, fetchUser]);

  useEffect(() => {
    if (user?.error) {
      // check to make sure error is what we expect, in case we get an unexpected server error object
      if (typeof user.error === 'string') {
        setErrorMessage(user.error);
      } else {
        setErrorMessage('Internal Server Error. Please try again');
      }
      setSnackBarOpen(true);
    }
  }, [user?.error]);

  useEffect(() => {
    if (user && user.id) router.push('/home');
    else router.push('/register');
  }, [user]);

  if (user?.isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {snackBarOpen && (
        <SnackbarError
          setSnackBarOpen={setSnackBarOpen}
          errorMessage={errorMessage}
          snackBarOpen={snackBarOpen}
        />
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Routes), { ssr: false });
