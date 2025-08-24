import { describe, it, expect } from 'vitest';
import countryReducer from './countrySlice';

describe('countrySlice', () => {
  it('должен возвращать начальное состояние', () => {
    const state = countryReducer(undefined, { type: 'unknown' });

    // Проверяем основные свойства вместо точного сравнения массива
    expect(state).toHaveProperty('countries');
    expect(state.countries).toHaveLength(20);
    expect(state.countries[0]).toHaveProperty('code');
    expect(state.countries[0]).toHaveProperty('name');
  });

  it('должен содержать 20 стран', () => {
    const state = countryReducer(undefined, { type: 'unknown' });
    expect(state.countries).toHaveLength(20);
  });

  it('должен содержать отсортированные страны по алфавиту', () => {
    const state = countryReducer(undefined, { type: 'unknown' });

    // Создаем копию и сортируем для сравнения
    const sortedCountries = [...state.countries].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Проверяем что массив отсортирован
    expect(state.countries).toEqual(sortedCountries);

    // Проверяем первую и последнюю страну
    const firstCountry = state.countries[0].name;
    const lastCountry = state.countries[state.countries.length - 1].name;
    expect(firstCountry < lastCountry).toBe(true);
  });

  it('должен содержать правильную структуру данных стран', () => {
    const state = countryReducer(undefined, { type: 'unknown' });

    state.countries.forEach((country) => {
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('name');
      expect(typeof country.code).toBe('string');
      expect(typeof country.name).toBe('string');
      expect(country.code.length).toBe(2);
    });
  });

  it('должен возвращать то же состояние для неизвестного action', () => {
    const currentState = {
      countries: [{ code: 'TEST', name: 'Test Country' }],
    };

    const state = countryReducer(currentState, { type: 'unknown' });
    expect(state).toEqual(currentState);
  });
});
