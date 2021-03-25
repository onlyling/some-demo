import { renderHook, act } from '@testing-library/react-hooks';

import useState from '../src/use-state';

describe('use-state', () => {
  test('string', () => {
    const { result } = renderHook(() => useState('1'));

    act(() => {
      result.current[1]('2');
    });

    expect(result.current[0]).toBe('2');
  });

  test('number', () => {
    const { result } = renderHook(() => useState(1));

    act(() => {
      result.current[1](2);
    });

    expect(result.current[0]).toBe(2);
  });

  test('boolean', () => {
    const { result } = renderHook(() => useState(false));

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  test('array', () => {
    const { result } = renderHook(() => useState([1]));
    const data = [1, 2, 3];

    act(() => {
      result.current[1](data);
    });

    expect(result.current[0]).toBe(data);
  });
});
