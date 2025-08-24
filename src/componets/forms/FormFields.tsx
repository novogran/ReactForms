import type { FormValues } from '../../utils/validation';
import type { Country } from '../../types';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';

interface FormFieldsProps {
  register?: UseFormRegister<FormValues>;
  errors?: FieldErrors<FormValues>;
  watch?: UseFormWatch<FormValues>;
  countries: Country[];
  submittedPassword?: string;
}

export const FormFields = ({
  register,
  errors,
  watch,
  submittedPassword = '',
}: FormFieldsProps) => {
  const passwordValue = watch?.('password') || '';
  const displayPassword = register ? passwordValue : submittedPassword;
  const [showPassword, setShowPassword] = useState(false);

  const allCountries = useAppSelector((state) => state.country.countries);

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(displayPassword);
  const strengthLabels = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong',
    'Very Strong',
  ];
  const strengthColors = [
    '#dc3545',
    '#fd7e14',
    '#ffc107',
    '#a0d911',
    '#52c41a',
    '#1890ff',
  ];

  return (
    <div className="form-fields">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          defaultValue=""
          autoComplete="name"
          {...(register && register('name'))}
          className={errors?.name ? 'error' : ''}
        />
        <span className="error-message">{errors?.name?.message || ''}</span>
      </div>

      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          autoComplete="age"
          defaultValue=""
          {...(register &&
            register('age', {
              valueAsNumber: true,
            }))}
          className={errors?.age ? 'error' : ''}
        />
        <span className="error-message">{errors?.age?.message}</span>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          {...(register && register('email'))}
          className={errors?.email ? 'error' : ''}
        />
        <span className="error-message">{errors?.email?.message}</span>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          autoComplete="password"
          type={showPassword ? 'text' : 'password'}
          {...(register && register('password'))}
          className={errors?.password ? 'error' : ''}
        />
        <label className="show-password-label">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show password
        </label>
        <div className="password-strength">
          <div className="strength-meter">
            <div
              className="strength-fill"
              style={{
                width: `${(passwordStrength / 5) * 100}%`,
                backgroundColor: strengthColors[passwordStrength],
              }}
            />
          </div>
          <span style={{ color: strengthColors[passwordStrength] }}>
            Strength: {strengthLabels[passwordStrength]}
          </span>
        </div>
        <span className="error-message">{errors?.password?.message}</span>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="password"
          type={showPassword ? 'text' : 'password'}
          {...(register && register('confirmPassword'))}
          className={errors?.confirmPassword ? 'error' : ''}
        />
        <span className="error-message">
          {errors?.confirmPassword?.message}
        </span>
      </div>

      <div className="form-group">
        <label>Gender</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="male"
              name="gender"
              autoComplete="gender"
              {...(register && register('gender'))}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              value="female"
              name="gender"
              autoComplete="gender"
              {...(register && register('gender'))}
            />
            Female
          </label>
        </div>
        <span className="error-message">{errors?.gender?.message}</span>
      </div>

      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input
          id="country"
          name="country"
          type="text"
          autoComplete="off"
          list="countries-list"
          {...(register && register('country'))}
          className={errors?.country ? 'error' : ''}
        />
        <datalist id="countries-list">
          {allCountries.map((country) => (
            <option key={country.code} value={country.name} />
          ))}
        </datalist>
        <span className="error-message">{errors?.country?.message}</span>
      </div>

      <div className="form-group">
        <label htmlFor="profilePicture">Profile Picture</label>
        <input
          id="profilePicture"
          name="profilePicture"
          type="file"
          accept="image/jpeg,image/png"
          {...(register && register('profilePicture'))}
        />
        <span className="error-message">
          {errors?.profilePicture?.message as string}
        </span>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            name="acceptTerms"
            type="checkbox"
            {...(register && register('acceptTerms'))}
          />
          I accept the Terms and Conditions
        </label>
        <span className="error-message">{errors?.acceptTerms?.message}</span>
      </div>
    </div>
  );
};
