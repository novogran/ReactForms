import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { FormFields } from './FormFields';
import type { FormValues } from '../../utils/validation';
import type { Country } from '../../types';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

let useAppSelector: Mock;
let getPasswordStrength: Mock;

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../../utils/passwordStrength', () => ({
  getPasswordStrength: vi.fn(),
}));

const mockRegister = vi.fn(() => ({
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: '',
}));

const mockWatch = vi.fn();

describe('FormFields', () => {
  const mockCountries: Country[] = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    const hooksModule = await import('../../store/hooks');
    const passwordModule = await import('../../utils/passwordStrength');

    useAppSelector = hooksModule.useAppSelector as unknown as Mock;
    getPasswordStrength = passwordModule.getPasswordStrength as Mock;

    useAppSelector.mockReturnValue(mockCountries);
    getPasswordStrength.mockReturnValue(3);
  });

  it('рендерит все поля формы', () => {
    render(<FormFields countries={mockCountries} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    const maleRadio = document.querySelector('input[value="male"]');
    const femaleRadio = document.querySelector('input[value="female"]');
    expect(maleRadio).toBeInTheDocument();
    expect(femaleRadio).toBeInTheDocument();

    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accept the terms/i)).toBeInTheDocument();
  });

  it('показывает ошибки валидации', () => {
    const errors: FieldErrors<FormValues> = {
      name: { message: 'Name is required', type: 'required' },
      email: { message: 'Invalid email', type: 'pattern' },
      password: { message: 'Password too weak', type: 'validate' },
    };

    render(<FormFields countries={mockCountries} errors={errors} />);

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByText('Password too weak')).toBeInTheDocument();
  });

  it('показывает силу пароля', () => {
    (getPasswordStrength as Mock).mockReturnValue(3);

    render(
      <FormFields
        countries={mockCountries}
        watch={mockWatch as unknown as UseFormWatch<FormValues>}
        register={mockRegister as unknown as UseFormRegister<FormValues>}
      />
    );

    const strengthElement = screen.getByText(/strength:/i);
    expect(strengthElement).toBeInTheDocument();

    expect(strengthElement.textContent).toContain('Good');
  });

  it('переключает видимость пароля', () => {
    render(<FormFields countries={mockCountries} />);

    const passwordInput = screen.getByLabelText(
      /^password$/i
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(
      /confirm password/i
    ) as HTMLInputElement;
    const showPasswordCheckbox = screen.getByLabelText(
      /show password/i
    ) as HTMLInputElement;

    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');

    fireEvent.click(showPasswordCheckbox);

    expect(passwordInput.type).toBe('text');
    expect(confirmPasswordInput.type).toBe('text');
  });

  it('работает с переданным submittedPassword', () => {
    const submittedPassword = 'Test123!';

    render(
      <FormFields
        countries={mockCountries}
        submittedPassword={submittedPassword}
      />
    );

    expect(getPasswordStrength).toHaveBeenCalledWith(submittedPassword);
  });

  it('отображает список стран в datalist', () => {
    render(<FormFields countries={mockCountries} />);

    const datalist = document.getElementById('countries-list');
    expect(datalist).toBeInTheDocument();

    mockCountries.forEach((country) => {
      const option = document.querySelector(`option[value="${country.name}"]`);
      expect(option).toBeInTheDocument();
      expect(option).toHaveAttribute('value', country.name);
    });
  });

  it('применяет класс error для невалидных полей', () => {
    const errors: FieldErrors<FormValues> = {
      name: { message: 'Error', type: 'required' },
    };

    const { container } = render(
      <FormFields countries={mockCountries} errors={errors} />
    );

    const nameInput = container.querySelector('#name');
    expect(nameInput?.classList.contains('error')).toBe(true);

    const emailInput = container.querySelector('#email');
    expect(emailInput?.classList.contains('error')).toBe(false);
  });

  it('регистрирует поля при передаче register функции', () => {
    render(
      <FormFields
        countries={mockCountries}
        register={mockRegister as unknown as UseFormRegister<FormValues>}
      />
    );

    expect(mockRegister).toHaveBeenCalledWith('name');
    expect(mockRegister).toHaveBeenCalledWith('age', { valueAsNumber: true });
    expect(mockRegister).toHaveBeenCalledWith('email');
    expect(mockRegister).toHaveBeenCalledWith('password');
    expect(mockRegister).toHaveBeenCalledWith('confirmPassword');
    expect(mockRegister).toHaveBeenCalledWith('gender');
    expect(mockRegister).toHaveBeenCalledWith('country');
    expect(mockRegister).toHaveBeenCalledWith('profilePicture');
    expect(mockRegister).toHaveBeenCalledWith('acceptTerms');
  });
});

describe('FormFields Edge Cases', () => {
  const mockCountries: Country[] = [{ code: 'US', name: 'United States' }];

  beforeEach(async () => {
    vi.clearAllMocks();

    const hooksModule = await import('../../store/hooks');
    const passwordModule = await import('../../utils/passwordStrength');

    useAppSelector = hooksModule.useAppSelector as unknown as Mock;
    getPasswordStrength = passwordModule.getPasswordStrength as Mock;
  });

  it('обрабатывает пустой массив стран', () => {
    (useAppSelector as Mock).mockReturnValue([]);

    render(<FormFields countries={[]} />);

    const datalist = document.getElementById('countries-list');
    expect(datalist).toBeInTheDocument();
  });

  it('обрабатывает нулевую сложность пароля', () => {
    (getPasswordStrength as Mock).mockReturnValue(0);

    render(<FormFields countries={mockCountries} />);

    const strengthElement = screen.getByText(/strength:/i);
    expect(strengthElement.textContent).toContain('Very Weak');
  });

  it('обрабатывает максимальную сложность пароля', () => {
    (getPasswordStrength as Mock).mockReturnValue(5);

    render(<FormFields countries={mockCountries} />);

    const strengthElement = screen.getByText(/strength:/i);
    expect(strengthElement.textContent).toContain('Very Strong');
  });

  it('не ломается при отсутствии ошибок', () => {
    render(<FormFields countries={mockCountries} errors={{}} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('корректно работает без register и watch функций', () => {
    render(<FormFields countries={mockCountries} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show password/i)).toBeInTheDocument();
  });

  it('обрабатывает undefined значения для ошибок', () => {
    const errors: Partial<FieldErrors<FormValues>> = {
      name: undefined,
      email: { message: 'Test error', type: 'required' },
    };

    render(
      <FormFields
        countries={mockCountries}
        errors={errors as FieldErrors<FormValues>}
      />
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('обрабатывает отсутствие стран из Redux store', () => {
    (useAppSelector as Mock).mockReturnValue([]);

    render(<FormFields countries={mockCountries} />);

    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('не вызывает getPasswordStrength при пустом пароле', () => {
    (getPasswordStrength as Mock).mockClear();

    render(<FormFields countries={mockCountries} submittedPassword="" />);

    expect(getPasswordStrength).toHaveBeenCalledWith('');
  });
});
