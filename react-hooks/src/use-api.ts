import { useCallback, useEffect } from 'react';

import useOriginalDeepCopy from './previous-value/use-original-deep-copy';
import useState from './use-state';

/**
 * 接口约定的基本参数
 */
export type BaseResponse<T> = {
  code: number;
  msg?: string;
  data: T;
};

export type UseAPIOption<PT> = {
  manual?: boolean;
  defaultParams?: PT;
  loading?: boolean;
};

type LocalState<T> = {
  loading: boolean;
  fail: boolean;
  data: T;
};

const defaultParams = {};

/**
 * 单个请求
 */
const useAPI = <T, PT = Record<string, any>>(
  initValue: T,
  fetchAPI: (p: any) => Promise<BaseResponse<T>>,
  option: UseAPIOption<PT> = {
    manual: false,
    defaultParams: defaultParams as PT,
  },
) => {
  /** 是否手动执行 */
  const manual = option.manual;
  /** 自动执行的可变参数 */
  const defaultParams = useOriginalDeepCopy(option.defaultParams);

  const [localState, setLocalState] = useState<LocalState<T>>({
    loading: option.loading || !option.manual,
    fail: false,
    data: initValue,
  });

  return {
    ...localState,
  };
};

export default useAPI;
