import { configureStore } from '@reduxjs/toolkit/react';
import { useAppDispatch, useAppSelector } from './hooks';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';

const testStore = configureStore({
  reducer: {
    form: () => ({ submissions: [], newSubmissionId: null }),
    country: () => ({ countries: [] }),
  },
});

describe('hooks', () => {
  it('useAppDispatch должен возвращать функцию', () => {
    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: ({ children }) => (
        <Provider store={testStore}>{children}</Provider>
      ),
    });
    expect(typeof result.current).toBe('function');
  });

  it('useAppSelector должен возвращать данные из store', () => {
    const { result } = renderHook(() => useAppSelector((state) => state.form), {
      wrapper: ({ children }) => (
        <Provider store={testStore}>{children}</Provider>
      ),
    });
    expect(result.current).toEqual({ submissions: [], newSubmissionId: null });
  });
});
