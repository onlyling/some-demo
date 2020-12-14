import { useMemo } from 'react';
import { init, RematchDispatch, RematchRootState } from '@rematch/core';
export { useDispatch, useSelector } from 'react-redux';
import { rootModel, RootModel } from './models';

export const initStore = (initialState = {}) =>
  init({
    models: rootModel,
    redux: {
      initialState,
    },
  });

export type Store = ReturnType<typeof initStore>;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

let store: Store | undefined;

export const initializeStore = (preloadedState?: any) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      // @ts-ignore
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export const useStore = (initialState: any) => {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
};
