import { describe, it, expect } from 'vitest';
import { getPasswordStrength } from './passwordStrength';

describe('getPasswordStrength', () => {
  it('возвращает 0 для пустого пароля', () => {
    expect(getPasswordStrength('')).toBe(0);
  });

  it('возвращает количество выполненных критериев для коротких паролей', () => {
    expect(getPasswordStrength('short')).toBe(1);

    expect(getPasswordStrength('123')).toBe(1);

    expect(getPasswordStrength('A1!')).toBe(3);
  });

  it('возвращает количество критериев для паролей ≥8 символов', () => {
    expect(getPasswordStrength('12345678')).toBe(2);

    expect(getPasswordStrength('password')).toBe(2);

    expect(getPasswordStrength('PASSWORD')).toBe(2);

    expect(getPasswordStrength('!@#$%^&*')).toBe(2);
  });

  it('возвращает 3 для паролей с тремя критериями', () => {
    expect(getPasswordStrength('pass1234')).toBe(3);

    expect(getPasswordStrength('PASS1234')).toBe(3);

    expect(getPasswordStrength('Password')).toBe(3);
  });

  it('возвращает 4 для паролей с четырьмя критериями', () => {
    expect(getPasswordStrength('Password123')).toBe(4);

    expect(getPasswordStrength('pass123!')).toBe(4);
  });

  it('возвращает 5 для паролей со всеми критериями', () => {
    expect(getPasswordStrength('Password123!')).toBe(5);

    expect(getPasswordStrength('P@ssw0rd')).toBe(5);

    expect(getPasswordStrength('Secur3#Pass')).toBe(5);
  });

  it('корректно работает с пробелами', () => {
    expect(getPasswordStrength('Pass 123')).toBe(5);
  });
});
