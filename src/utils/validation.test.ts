import { describe, it, expect, vi } from 'vitest';
import { formSchema } from './validation';

vi.mock('../store', () => ({
  store: {
    getState: () => ({
      country: {
        countries: [{ name: 'Russia' }, { name: 'USA' }, { name: 'Germany' }],
      },
    }),
  },
}));

describe('formSchema', () => {
  const validData = {
    name: 'John',
    age: 25,
    email: 'test@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    gender: 'male',
    acceptTerms: true,
    profilePicture: null,
    country: 'Russia',
  };

  it('валидирует корректные данные', async () => {
    await expect(formSchema.parseAsync(validData)).resolves.toEqual(validData);
  });

  it('требует имя', async () => {
    const data = { ...validData, name: '' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Name is required'
    );
  });

  it('требует имя с заглавной буквы', async () => {
    const data = { ...validData, name: 'john' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Name must start with uppercase letter'
    );
  });

  it('проверяет минимальный возраст', async () => {
    const data = { ...validData, age: -1 };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Age cannot be negative'
    );
  });

  it('проверяет максимальный возраст', async () => {
    const data = { ...validData, age: 151 };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Age seems unrealistic'
    );
  });

  it('требует email', async () => {
    const data = { ...validData, email: '' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Email is required'
    );
  });

  it('проверяет валидность email', async () => {
    const data = { ...validData, email: 'invalid' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Invalid email address'
    );
  });

  it('требует пароль', async () => {
    const data = { ...validData, password: '' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Password is required'
    );
  });

  it('проверяет длину пароля', async () => {
    const data = { ...validData, password: 'short' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Password must be at least 8 characters'
    );
  });

  it('проверяет цифры в пароле', async () => {
    const data = { ...validData, password: 'Password!' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Password must contain at least one number'
    );
  });

  it('проверяет заглавные буквы в пароле', async () => {
    const data = { ...validData, password: 'password123!' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Password must contain at least one uppercase letter'
    );
  });

  it('проверяет строчные буквы в пароле', async () => {
    const data = { ...validData, password: 'PASSWORD123!' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Password must contain at least one lowercase letter'
    );
  });

  it('проверяет специальные символы в пароле', async () => {
    const data = { ...validData, password: 'Password123' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Password must contain at least one special character'
    );
  });

  it('требует подтверждение пароля', async () => {
    const data = { ...validData, confirmPassword: '' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Please confirm your password'
    );
  });

  it('проверяет совпадение паролей', async () => {
    const data = { ...validData, confirmPassword: 'Different123!' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      "Passwords don't match"
    );
  });

  it('требует выбор пола', async () => {
    const data = { ...validData, gender: '' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Gender is required'
    );
  });

  it('требует принятие условий', async () => {
    const data = { ...validData, acceptTerms: false };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'You must accept the terms and conditions'
    );
  });

  it('проверяет размер файла', async () => {
    const largeFile = { size: 6 * 1024 * 1024, type: 'image/jpeg' };
    const data = { ...validData, profilePicture: [largeFile] };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'File size must be less than 5MB'
    );
  });

  it('проверяет тип файла', async () => {
    const invalidFile = { size: 1024, type: 'application/pdf' };
    const data = { ...validData, profilePicture: [invalidFile] };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Only JPEG and PNG images are allowed'
    );
  });

  it('требует выбор страны', async () => {
    const data = { ...validData, country: '' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Country is required'
    );
  });

  it('проверяет валидность страны', async () => {
    const data = { ...validData, country: 'InvalidCountry' };
    await expect(formSchema.parseAsync(data)).rejects.toThrow(
      'Please select a valid country from the list'
    );
  });
});
