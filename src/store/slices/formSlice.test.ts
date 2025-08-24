import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import formReducer, {
  addSubmission,
  clearNewSubmission,
  removeSubmission,
} from './formSlice';
import type { FormData } from '../../types';

describe('formSlice', () => {
  const mockFormData: Omit<FormData, 'id'> = {
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    gender: 'male',
    acceptTerms: true,
    profilePicture: null,
    country: 'United States',
    createdAt: '',
    formType: 'uncontrolled',
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('должен возвращать начальное состояние', () => {
    const state = formReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      submissions: [],
      newSubmissionId: null,
    });
  });

  it('должен добавлять новую заявку', () => {
    vi.setSystemTime(1000);
    const action = addSubmission(mockFormData);
    const state = formReducer(undefined, action);

    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].name).toBe('John Doe');
    expect(state.submissions[0].id).toBe('1000');
    expect(state.newSubmissionId).toBe('1000');
  });

  it('должен очищать ID новой заявки', () => {
    const initialState = {
      submissions: [],
      newSubmissionId: '123',
    };

    const state = formReducer(initialState, clearNewSubmission());
    expect(state.newSubmissionId).toBeNull();
  });

  it('должен удалять заявку', () => {
    const initialState = {
      submissions: [
        { ...mockFormData, id: '1' },
        { ...mockFormData, id: '2' },
      ],
      newSubmissionId: null,
    };

    const state = formReducer(initialState, removeSubmission('1'));

    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].id).toBe('2');
  });

  it('должен генерировать уникальный ID для каждой заявки', () => {
    vi.setSystemTime(1000);
    const action1 = addSubmission(mockFormData);
    const state1 = formReducer(undefined, action1);

    vi.setSystemTime(2000);
    const action2 = addSubmission(mockFormData);
    const state2 = formReducer(state1, action2);

    expect(state1.submissions[0].id).toBe('1000');
    expect(state2.submissions[1].id).toBe('2000');
    expect(state2.submissions).toHaveLength(2);
  });
});
