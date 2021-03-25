import { useRef, useEffect } from 'react';
import shallowEquals from 'shallowequal';

type CustomEquals<T> = (previous: T | undefined, current: T) => boolean;

/**
 * 使用原始数据
 * @param value 一个数据值
 * @param equals 对比方式，默认 shallowEquals
 */
const useOriginalCopy = <T,>(value: T, equals: CustomEquals<T> = shallowEquals): T => {
  const cache = useRef<T>(value);
  const equalsRef = useRef(equals);

  useEffect(() => {
    equalsRef.current = equals;
  }, [equals]);

  useEffect(() => {
    if (!equalsRef.current(cache.current, value)) {
      cache.current = value;
    }
  }, [value]);

  return equals(cache.current, value) ? cache.current : value;
};

export default useOriginalCopy;
