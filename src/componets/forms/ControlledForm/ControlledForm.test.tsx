import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ControlledForm from './ControlledForm';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import formReducer from '../../../store/slices/formSlice';
import countryReducer from '../../../store/slices/countrySlice';
import { convertFileToBase64 } from '../../../utils/convertFileToBase64';

vi.mock('../../../utils/convertFileToBase64', () => ({
  convertFileToBase64: vi.fn().mockResolvedValue('mock-base64-string'),
}));

const mockStore = configureStore({
  reducer: {
    form: formReducer,
    country: countryReducer,
  },
});

const mockCountries = [
  { code: 'US', name: 'United States' },
  { code: 'RU', name: 'Russia' },
];

describe('ControlledForm', () => {
  it('рендерит форму с полями', () => {
    render(
      <Provider store={mockStore}>
        <ControlledForm onClose={vi.fn()} countries={mockCountries} />
      </Provider>
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('закрывает форму по кнопке Cancel', () => {
    const onClose = vi.fn();
    render(
      <Provider store={mockStore}>
        <ControlledForm onClose={onClose} countries={mockCountries} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('успешно отправляет форму', async () => {
    const onClose = vi.fn();
    render(
      <Provider store={mockStore}>
        <ControlledForm onClose={onClose} countries={mockCountries} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Age'), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByLabelText('Male'));
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'United States' },
    });
    fireEvent.click(screen.getByLabelText('I accept the Terms and Conditions'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('успешно отправляет форму с файлом', async () => {
    const onClose = vi.fn();
    render(
      <Provider store={mockStore}>
        <ControlledForm onClose={onClose} countries={mockCountries} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Age'), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByLabelText('Male'));
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'United States' },
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Profile Picture'), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByLabelText('I accept the Terms and Conditions'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(convertFileToBase64).toHaveBeenCalledWith(file);
    });
  });

  it('показывает ошибки валидации', async () => {
    const onClose = vi.fn();
    render(
      <Provider store={mockStore}>
        <ControlledForm onClose={onClose} countries={mockCountries} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'john' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(
        screen.getByText(/name must start with uppercase letter/i)
      ).toBeInTheDocument();
    });
  });

  it('блокирует кнопку Submit когда форма не валидна', async () => {
    const onClose = vi.fn();
    render(
      <Provider store={mockStore}>
        <ControlledForm onClose={onClose} countries={mockCountries} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'john' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
  });

  it('блокирует кнопку во время отправки', async () => {
    const onClose = vi.fn();
    vi.mocked(convertFileToBase64).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve('base64'), 100))
    );

    render(
      <Provider store={mockStore}>
        <ControlledForm onClose={onClose} countries={mockCountries} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByLabelText('Male'));
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'United States' },
    });
    fireEvent.click(screen.getByLabelText('I accept the Terms and Conditions'));

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
