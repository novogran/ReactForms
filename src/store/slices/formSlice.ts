import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type FormData } from '../../types';

interface FormState {
  submissions: FormData[];
  newSubmissionId: string | null;
}

const initialState: FormState = {
  submissions: [],
  newSubmissionId: null,
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addSubmission: (state, action: PayloadAction<Omit<FormData, 'id'>>) => {
      const newSubmission: FormData = {
        ...action.payload,
        id: Date.now().toString(),
      };

      state.submissions.push(newSubmission);
      state.newSubmissionId = newSubmission.id;
    },
    clearNewSubmission: (state) => {
      state.newSubmissionId = null;
    },
    removeSubmission: (state, action: PayloadAction<string>) => {
      state.submissions = state.submissions.filter(
        (submission) => submission.id !== action.payload
      );
    },
  },
});

export const { addSubmission, clearNewSubmission, removeSubmission } =
  formSlice.actions;
export default formSlice.reducer;
