import { renderHook } from '@testing-library/react-hooks';

import useDestroyed from '../src/use-destroyed';

describe('useDestroyed', () => {
  test('test mount', () => {
    const { result } = renderHook(() => useDestroyed());

    expect(result.current()).toBe(false);
  });

  test('test unmounted', async () => {
    const { unmount, result } = renderHook(() => useDestroyed());

    unmount();

    expect(result.current()).toBe(true);
  });
});
