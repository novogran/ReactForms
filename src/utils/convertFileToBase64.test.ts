import { describe, it, expect } from 'vitest';
import { convertFileToBase64 } from './convertFileToBase64';

describe('convertFileToBase64', () => {
  it('конвертирует PNG файл', async () => {
    const file = new File(['content'], 'image.png', { type: 'image/png' });
    const result = await convertFileToBase64(file);
    expect(result.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('конвертирует JPG файл', async () => {
    const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
    const result = await convertFileToBase64(file);
    expect(result.startsWith('data:image/jpeg;base64,')).toBe(true);
  });

  it('возвращает ошибку при неверном формате файла', async () => {
    const file = new File(['content'], 'file.pdf', { type: 'application/pdf' });
    await expect(convertFileToBase64(file)).rejects.toThrow(
      'Недопустимый формат файла'
    );
  });
});
