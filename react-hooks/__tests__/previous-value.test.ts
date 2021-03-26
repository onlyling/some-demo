import { renderHook } from '@testing-library/react-hooks';

import useOriginalCopy from '../src/previous-value/use-original-copy';
import useOriginalDeepCopy from '../src/previous-value/use-original-deep-copy';

describe('previous-value -> useOriginalCopy', () => {
  test('test number', () => {
    const { result } = renderHook(() => useOriginalCopy(1));

    expect(result.current).toBe(1);
  });

  test('test object shallowequal', () => {
    let data = { a: 1 };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalCopy(data));

    data = { a: 1 };
    rerender();

    expect(result.current).toBe(data2);
  });

  test('test object update', () => {
    let data = { a: 1 };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalCopy(data));

    data = { a: 2 };
    rerender();

    expect(result.current).not.toBe(data2);
  });

  test('test object shallowequal2', () => {
    let data = { a: { a: 1 } };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalCopy(data));

    data = { a: { a: 1 } };
    rerender();

    expect(result.current).not.toBe(data2);
  });
});

describe('previous-value -> useOriginalDeepCopy', () => {
  test('test number', () => {
    const { result } = renderHook(() => useOriginalDeepCopy(1));

    expect(result.current).toBe(1);
  });

  test('test object shallowequal', () => {
    let data = { a: 1 };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalDeepCopy(data));

    data = { a: 1 };
    rerender();

    expect(result.current).toBe(data2);
  });

  test('test object update', () => {
    let data = { a: 1 };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalDeepCopy(data));

    data = { a: 2 };
    rerender();

    expect(result.current).not.toBe(data2);
  });

  test('test object deepEquals', () => {
    let data = { a: { a: 1 } };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalDeepCopy(data));

    data = { a: { a: 1 } };
    rerender();

    expect(result.current).toBe(data2);
  });
});
