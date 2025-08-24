import { describe, it, expect } from 'vitest';
import { store } from './index';

describe('store', () => {
  it('должен быть правильно сконфигурирован', () => {
    const state = store.getState();

    expect(state).toHaveProperty('form');
    expect(state).toHaveProperty('country');
    expect(state.form).toEqual({ submissions: [], newSubmissionId: null });
    expect(state.country.countries.length).toBeGreaterThan(0);
  });

  it('должен иметь правильные типы', () => {
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });
});
