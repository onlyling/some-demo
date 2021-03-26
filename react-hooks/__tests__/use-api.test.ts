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
    const { result, waitForNextUpdate } = renderHook(() =>
      useAPI<MockData, MockData>(defaultValue, mockFetch1, {
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
      result.current.run(defaultParams);
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate({ timeout: 600 });

    expect(result.current.loading).toBe(false);
    expect(result.current.fail).toBe(false);
    expect(result.current.data).toBe(defaultParams);
    expect(result.current.data.a).toBe(1);
  });

  test('test loading and manual', () => {
    const { result } = renderHook(() =>
      useAPI<MockData, MockData>({}, mockFetch1, {
        manual: true,
        loading: true,
      }),
    );

    expect(result.current.loading).toBe(true);
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
      result.current.run().catch(() => {});
    });

    expect(result.current.fail).toBe(false);

    await waitForNextUpdate({ timeout: 600 });

    expect(result.current.fail).toBe(true);
  });
});
