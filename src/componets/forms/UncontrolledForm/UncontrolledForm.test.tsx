import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UncontrolledForm from './UncontrolledForm';
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

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит форму с полями', () => {
    render(
      <Provider store={mockStore}>
        <UncontrolledForm onClose={vi.fn()} countries={mockCountries} />
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
        <UncontrolledForm onClose={onClose} countries={mockCountries} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('успешно отправляет форму с файлом', async () => {
    const onClose = vi.fn();
    render(
      <Provider store={mockStore}>
        <UncontrolledForm onClose={onClose} countries={mockCountries} />
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

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Profile Picture'), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByLabelText('I accept the Terms and Conditions'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('успешно отправляет форму без файла', async () => {
    const onClose = vi.fn();
    render(
      <Provider store={mockStore}>
        <UncontrolledForm onClose={onClose} countries={mockCountries} />
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
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('показывает ошибки валидации', async () => {
    const onClose = vi.fn();
    render(
      <Provider store={mockStore}>
        <UncontrolledForm onClose={onClose} countries={mockCountries} />
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

  it('обрабатывает ошибку конвертации файла', async () => {
    const onClose = vi.fn();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});

    vi.mocked(convertFileToBase64).mockRejectedValueOnce(
      new Error('Conversion failed')
    );

    render(
      <Provider store={mockStore}>
        <UncontrolledForm onClose={onClose} countries={mockCountries} />
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

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Profile Picture'), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByLabelText('I accept the Terms and Conditions'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Unexpected error:',
        expect.any(Error)
      );
      expect(alert).toHaveBeenCalledWith(
        'An unexpected error occurred. Please try again.'
      );
    });

    consoleError.mockRestore();
    alert.mockRestore();
  });
});
