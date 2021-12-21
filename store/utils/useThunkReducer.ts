// Original code from https://github.com/nathanbuchar/react-hook-thunk-reducer

import { useCallback, useRef, useState, useMemo } from 'react';
import { createSocket } from '../../socket';
import { State, Dispatch, Reducer } from '../../types';
import { Action } from '../actions';

export default function useThunkReducer(
  reducer: Reducer,
  initialArg: { user: { isFetching: boolean } }
): [State, Dispatch] {
  const [hookState, setHookState] = useState<State>(initialArg);

  // State management.
  const state = useRef(hookState);
  const getState = useCallback(() => state.current, [state]);
  const setState = useCallback(
    (newState) => {
      state.current = newState;
      setHookState(newState);
    },
    [state, setHookState]
  );

  // Reducer.
  const reduce = useCallback(
    (action: Action): State => {
      return reducer(getState(), action);
    },
    [reducer, getState]
  );

  // Augmented dispatcher.
  const dispatch: Dispatch = useCallback(
    (action) => {
      return typeof action === 'function'
        ? action(dispatch, getState, socket)
        : Promise.resolve(setState(reduce(action)));
    },
    [getState, setState, reduce]
  );

  const socket = useMemo(() => createSocket(dispatch), [dispatch]);

  return [hookState, dispatch];
}
