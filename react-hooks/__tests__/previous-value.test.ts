import { renderHook } from '@testing-library/react-hooks';

import useOriginalCopy from '../src/previous-value/use-original-copy';
import useOriginalDeepCopy from '../src/previous-value/use-original-deep-copy';

describe('previous-value -> use-original-copy', () => {
  test('useOriginalCopy number', () => {
    const { result } = renderHook(() => useOriginalCopy(1));

    expect(result.current).toBe(1);
  });

  test('useOriginalCopy object shallowequal', () => {
    let data = { a: 1 };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalCopy(data));

    data = { a: 1 };
    rerender();

    expect(result.current).toBe(data2);
  });

  test('useOriginalCopy object update', () => {
    let data = { a: 1 };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalCopy(data));

    data = { a: 2 };
    rerender();

    expect(result.current).not.toBe(data2);
  });

  test('useOriginalCopy object shallowequal2', () => {
    let data = { a: { a: 1 } };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalCopy(data));

    data = { a: { a: 1 } };
    rerender();

    expect(result.current).not.toBe(data2);
  });
});

describe('previous-value -> use-original-deep-copy', () => {
  test('useOriginalDeepCopy number', () => {
    const { result } = renderHook(() => useOriginalDeepCopy(1));

    expect(result.current).toBe(1);
  });

  test('useOriginalDeepCopy object shallowequal', () => {
    let data = { a: 1 };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalDeepCopy(data));

    data = { a: 1 };
    rerender();

    expect(result.current).toBe(data2);
  });

  test('useOriginalDeepCopy object update', () => {
    let data = { a: 1 };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalDeepCopy(data));

    data = { a: 2 };
    rerender();

    expect(result.current).not.toBe(data2);
  });

  test('useOriginalDeepCopy object deepEquals', () => {
    let data = { a: { a: 1 } };
    const data2 = data;
    const { result, rerender } = renderHook(() => useOriginalDeepCopy(data));

    data = { a: { a: 1 } };
    rerender();

    expect(result.current).toBe(data2);
  });
});
