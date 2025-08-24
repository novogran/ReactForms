import { z } from 'zod';
import { store } from '../store';

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(/^[A-Z]/, 'Name must start with uppercase letter'),

    age: z
      .number()
      .min(1, 'Age is required')
      .min(0, 'Age cannot be negative')
      .max(150, 'Age seems unrealistic'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    gender: z.string().min(1, 'Gender is required'),

    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),

    profilePicture: z
      .any()
      .optional()
      .refine(
        (files) =>
          !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
        {
          message: 'File size must be less than 5MB',
        }
      )
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          ['image/jpeg', 'image/png'].includes(files[0]?.type),
        {
          message: 'Only JPEG and PNG images are allowed',
        }
      ),

    country: z
      .string()
      .min(1, 'Country is required')
      .refine(
        (value) => {
          const countries = store.getState().country.countries;
          return countries.some((country) => country.name === value);
        },
        {
          message: 'Please select a valid country from the list',
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type FormValues = z.infer<typeof formSchema>;
