import { describe, it, expect } from 'vitest';
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

  it('должен возвращать начальное состояние', () => {
    const state = formReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      submissions: [],
      newSubmissionId: null,
    });
  });

  it('должен добавлять новую заявку', () => {
    const action = addSubmission(mockFormData);
    const state = formReducer(undefined, action);

    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].name).toBe('John Doe');
    expect(state.submissions[0].id).toBeDefined();
    expect(state.newSubmissionId).toBe(state.submissions[0].id);
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
    const action1 = addSubmission(mockFormData);
    const state1 = formReducer(undefined, action1);

    const action2 = addSubmission(mockFormData);
    const state2 = formReducer(state1, action2);

    expect(state1.submissions[0].id).not.toBe(state2.submissions[1].id);
    expect(state2.submissions).toHaveLength(2);
  });
});
