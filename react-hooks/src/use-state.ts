import { useState, useCallback } from 'react';

import * as isType from './helpers/typeof';
import useDestroyed from './use-destroyed';

type UpdateStateParam<T> = Partial<T> | ((s: T) => T);

type UpdateState<T> = (p: UpdateStateParam<T>) => void;

/**
 * useState 类似 this.setState 可以传入部分字段更新
 * @param state 状态
 */
const useStateUpdate = <T>(state: T): [T, UpdateState<T>] => {
  const [localState, setLocalState] = useState<T>(state);
  const getDestroyed = useDestroyed();
  const updateState = useCallback(
    (s: UpdateStateParam<T>) => {
      if (!getDestroyed()) {
        setLocalState((ls) => {
          const value = isType.isFunction(s) ? s(ls) : s;

          if (isType.isObject(ls)) {
            return {
              ...ls,
              ...value,
            };
          }

          return value as T;
        });
      }
    },
    [getDestroyed],
  );

  return [localState, updateState];
};

export default useStateUpdate;
