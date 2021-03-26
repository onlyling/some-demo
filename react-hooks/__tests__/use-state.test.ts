import { renderHook, act } from '@testing-library/react-hooks';

import useState from '../src/use-state';

describe('useState', () => {
  test('test string', () => {
    const { result } = renderHook(() => useState('1'));

    act(() => {
      result.current[1]('2');
    });

    expect(result.current[0]).toBe('2');
  });

  test('test string:callback', () => {
    const { result } = renderHook(() => useState('1'));

    act(() => {
      result.current[1](() => '2');
    });

    expect(result.current[0]).toBe('2');
  });

  test('test number', () => {
    const { result } = renderHook(() => useState(1));

    act(() => {
      result.current[1](2);
    });

    expect(result.current[0]).toBe(2);
  });

  test('test number:callback', () => {
    const { result } = renderHook(() => useState(1));

    act(() => {
      result.current[1](() => 2);
    });

    expect(result.current[0]).toBe(2);
  });

  test('test boolean', () => {
    const { result } = renderHook(() => useState(false));

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  test('test boolean:callback', () => {
    const { result } = renderHook(() => useState(false));

    act(() => {
      result.current[1](() => true);
    });

    expect(result.current[0]).toBe(true);
  });

  test('test array', () => {
    const { result } = renderHook(() => useState([1]));
    const data = [1, 2, 3];

    act(() => {
      result.current[1](data);
    });

    expect(result.current[0]).toBe(data);
  });

  test('test array:callback', () => {
    const { result } = renderHook(() => useState([1]));
    const data = [1, 2, 3];

    act(() => {
      result.current[1](() => data);
    });

    expect(result.current[0]).toBe(data);
  });

  test('test object -> basic data', () => {
    const dataArray = [1];
    const dataObject = { a: 1 };
    const { result } = renderHook(() =>
      useState({
        key1: 1,
        key2: '1',
        key3: false,
        key11: 1,
        key22: '1',
        key33: false,
        o1: dataArray,
        o2: dataObject,
      }),
    );

    act(() => {
      result.current[1]({ key1: 2, key2: '2', key3: true });
    });

    expect(result.current[0].key1).toBe(2);
    expect(result.current[0].key2).toBe('2');
    expect(result.current[0].key3).toBe(true);
    expect(result.current[0].key11).toBe(1);
    expect(result.current[0].key22).toBe('1');
    expect(result.current[0].key33).toBe(false);
    expect(result.current[0].o1).toBe(dataArray);
    expect(result.current[0].o2).toBe(dataObject);
  });

  test('test object:callback -> basic data', () => {
    const dataArray = [1];
    const dataObject = { a: 1 };
    const { result } = renderHook(() =>
      useState({
        key1: 1,
        key2: '1',
        key3: false,
        key11: 1,
        key22: '1',
        key33: false,
        o1: dataArray,
        o2: dataObject,
      }),
    );

    act(() => {
      result.current[1]((s) => ({
        ...s,
        key1: 2,
        key2: '2',
        key3: true,
      }));
    });

    expect(result.current[0].key1).toBe(2);
    expect(result.current[0].key2).toBe('2');
    expect(result.current[0].key3).toBe(true);
    expect(result.current[0].key11).toBe(1);
    expect(result.current[0].key22).toBe('1');
    expect(result.current[0].key33).toBe(false);
    expect(result.current[0].o1).toBe(dataArray);
    expect(result.current[0].o2).toBe(dataObject);
  });

  test('test object -> reference data', () => {
    const dataArray = [1];
    const dataObject = { a: 1 };
    const { result } = renderHook(() =>
      useState({
        key1: 1,
        key2: '1',
        key3: false,
        o1: dataArray,
        o2: dataObject,
        o11: dataArray,
        o22: dataObject,
      }),
    );

    const dataArray2 = [2];
    const dataObject2 = { a: 2 };

    act(() => {
      result.current[1]({ o1: dataArray2, o2: dataObject2 });
    });

    expect(result.current[0].key1).toBe(1);
    expect(result.current[0].key2).toBe('1');
    expect(result.current[0].key3).toBe(false);
    expect(result.current[0].o1).toBe(dataArray2);
    expect(result.current[0].o1[0]).toBe(2);
    expect(result.current[0].o2).toBe(dataObject2);
    expect(result.current[0].o2.a).toBe(2);
    expect(result.current[0].o11).toBe(dataArray);
    expect(result.current[0].o11[0]).toBe(1);
    expect(result.current[0].o22).toBe(dataObject);
    expect(result.current[0].o22.a).toBe(1);
  });

  test('test object:callback -> reference data', () => {
    const dataArray = [1];
    const dataObject = { a: 1 };
    const { result } = renderHook(() =>
      useState({
        key1: 1,
        key2: '1',
        key3: false,
        o1: dataArray,
        o2: dataObject,
        o11: dataArray,
        o22: dataObject,
      }),
    );

    const dataArray2 = [2];
    const dataObject2 = { a: 2 };

    act(() => {
      result.current[1]((s) => ({
        ...s,
        o1: dataArray2,
        o2: dataObject2,
      }));
    });

    expect(result.current[0].key1).toBe(1);
    expect(result.current[0].key2).toBe('1');
    expect(result.current[0].key3).toBe(false);
    expect(result.current[0].o1).toBe(dataArray2);
    expect(result.current[0].o1[0]).toBe(2);
    expect(result.current[0].o2).toBe(dataObject2);
    expect(result.current[0].o2.a).toBe(2);
    expect(result.current[0].o11).toBe(dataArray);
    expect(result.current[0].o11[0]).toBe(1);
    expect(result.current[0].o22).toBe(dataObject);
    expect(result.current[0].o22.a).toBe(1);
  });

  test('test string:unmounted', () => {
    const { unmount, result } = renderHook(() => useState('1'));

    unmount();

    act(() => {
      result.current[1]('2');
    });

    expect(result.current[0]).toBe('1');
  });
});
