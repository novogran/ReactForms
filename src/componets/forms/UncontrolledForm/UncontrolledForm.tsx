import React, { useRef, useState } from 'react';
import { FormFields } from '../FormFields';
import type { Country } from '../../../types';
import { useAppDispatch } from '../../../store/hooks';
import { addSubmission } from '../../../store/slices/formSlice';
import { formSchema, type FormValues } from '../../../utils/validation';
import z from 'zod';
import { convertFileToBase64 } from '../../../utils/convertFileToBase64';
import type { FieldErrors } from 'react-hook-form';

interface UncontrolledFormProps {
  onClose: () => void;
  countries: Country[];
}

const UncontrolledForm = ({ onClose, countries }: UncontrolledFormProps) => {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const [formErrors, setFormErrors] = useState<FieldErrors<FormValues>>({});
  const [submittedPassword, setSubmittedPassword] = useState('');
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const profilePictureFile = formData.get('profilePicture') as File | null;
    const password = formData.get('password') as string;
    setSubmittedPassword(password);
    const rawData = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      email: formData.get('email') as string,
      password: password,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as string,
      acceptTerms: formData.get('acceptTerms') === 'on',
      profilePicture: profilePictureFile,
      country: formData.get('country') as string,
    };

    try {
      const dataToValidate = {
        ...rawData,
        profilePicture: profilePictureFile
          ? createFileList(profilePictureFile)
          : undefined,
      };

      const validatedData = formSchema.parse(dataToValidate);

      let profilePictureBase64: string | null = null;
      if (
        validatedData.profilePicture &&
        validatedData.profilePicture.length > 0
      ) {
        const file = validatedData.profilePicture[0];
        profilePictureBase64 = await convertFileToBase64(file);
      }

      const submissionData = {
        name: validatedData.name,
        age: validatedData.age,
        email: validatedData.email,
        password: validatedData.password,
        confirmPassword: validatedData.confirmPassword,
        gender: validatedData.gender,
        acceptTerms: validatedData.acceptTerms,
        profilePicture: profilePictureBase64,
        country: validatedData.country,
        createdAt: new Date().toISOString(),
        formType: 'uncontrolled' as const,
      };

      dispatch(addSubmission(submissionData));
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: FieldErrors<FormValues> = {};
        error.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            const fieldName = issue.path[0] as keyof FormValues;
            errors[fieldName] = {
              type: 'validation',
              message: issue.message,
            };
          }
        });
        setFormErrors(errors);
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const createFileList = (file: File): FileList => {
    return {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
      [Symbol.iterator]: function* () {
        yield file;
      },
    } as unknown as FileList;
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form">
      <FormFields
        countries={countries}
        errors={formErrors}
        submittedPassword={submittedPassword}
      />

      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};

export default UncontrolledForm;
