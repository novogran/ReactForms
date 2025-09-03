import { createSlice } from '@reduxjs/toolkit';
import { type Country } from '../../types';

export interface CountryState {
  countries: Country[];
}

const initialState: CountryState = {
  countries: [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IN', name: 'India' },
    { code: 'CN', name: 'China' },
    { code: 'RU', name: 'Russia' },
    { code: 'MX', name: 'Mexico' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'KR', name: 'South Korea' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'EG', name: 'Egypt' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'AR', name: 'Argentina' },
  ].sort((a, b) => a.name.localeCompare(b.name)),
};

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {},
});

export default countrySlice.reducer;
