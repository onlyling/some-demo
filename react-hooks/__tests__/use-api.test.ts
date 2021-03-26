import { renderHook, act } from '@testing-library/react-hooks';

import type { BaseResponse } from '../src/use-api';
import useAPI from '../src/use-api';

type MockData = Record<string, any>;

const mockFetch1 = (param: MockData): Promise<BaseResponse<MockData>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, data: param });
    }, 500);
  });

const mockFetch2 = (param: MockData): Promise<BaseResponse<MockData>> =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(param);
    }, 500);
  });

describe('useAPI', () => {
  test('test auto', async () => {
    const defaultValue = {};
    const defaultParams = { a: 1 };
    const { result, waitForNextUpdate } = renderHook(() =>
      useAPI<MockData, MockData>(defaultValue, mockFetch1, {
        defaultParams: defaultParams,
      }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.fail).toBe(false);
    expect(result.current.data).toBe(defaultValue);

    await waitForNextUpdate({ timeout: 600 });

    expect(result.current.loading).toBe(false);
    expect(result.current.fail).toBe(false);
    expect(result.current.data).toBe(defaultParams);
    expect(result.current.data.a).toBe(1);

    const newValue = {
      b: 2,
    };

    act(() => {
      result.current.setState({
        data: newValue,
      });
    });

    expect(result.current.data).toBe(newValue);
    expect(result.current.data.a).toBeUndefined();
    expect(result.current.data.b).toBe(2);
  });

  test('test manual', async () => {
    const defaultValue = {};
    const defaultParams = { a: 1 };
    const testFetch = jest.fn(mockFetch1);
    const testThen = jest.fn(() => {});
    const { result, waitForNextUpdate } = renderHook(() =>
      useAPI<MockData, MockData>(defaultValue, testFetch, {
        manual: true,
      }),
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.fail).toBe(false);
    expect(result.current.data).toBe(defaultValue);

    const newValue = {
      b: 2,
    };

    act(() => {
      result.current.setState({
        data: newValue,
      });
    });

    expect(result.current.data).toBe(newValue);
    expect(result.current.data.a).toBeUndefined();
    expect(result.current.data.b).toBe(2);

    act(() => {
      result.current
        .run(defaultParams)
        .then(testThen)
        .catch(() => {});
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate({ timeout: 600 });

    expect(testFetch).toBeCalledTimes(1);
    expect(testThen).toBeCalledTimes(1);

    expect(result.current.loading).toBe(false);
    expect(result.current.fail).toBe(false);
    expect(result.current.data).toBe(defaultParams);
    expect(result.current.data.a).toBe(1);
  });

  test('test loading and manual', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAPI<MockData, MockData>({}, mockFetch1, {
        manual: true,
        loading: true,
      }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.fail).toBe(false);

    act(() => {
      result.current
        .run()
        .then(() => {})
        .catch(() => {});
    });

    expect(result.current.fail).toBe(false);

    await waitForNextUpdate({ timeout: 600 });

    expect(result.current.fail).toBe(false);
  });

  test('test fail', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAPI<MockData, MockData>({}, mockFetch2, {
        defaultParams: {},
      }),
    );

    expect(result.current.fail).toBe(false);

    await waitForNextUpdate({ timeout: 600 });

    expect(result.current.fail).toBe(true);

    act(() => {
      result.current
        .run()
        .then(() => {})
        .catch(() => {});
    });

    expect(result.current.fail).toBe(false);

    await waitForNextUpdate({ timeout: 600 });

    expect(result.current.fail).toBe(true);
  });

  test('test no option', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAPI<MockData, MockData>({}, mockFetch1),
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate({ timeout: 600 });

    expect(result.current.loading).toBe(false);
  });
});
