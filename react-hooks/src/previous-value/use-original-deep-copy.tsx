import deepEquals from 'fast-deep-equal';

import useOriginalCopy from './use-original-copy';

/**
 * 深度复制、对比一个数据
 * @param value 一个值
 */
const useOriginalDeepCopy = <T,>(value: T): T => useOriginalCopy<T>(value, deepEquals);

export default useOriginalDeepCopy;
