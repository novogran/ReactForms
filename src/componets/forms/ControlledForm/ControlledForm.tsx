import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFields } from '../FormFields';
import type { Country } from '../../../types';
import { useAppDispatch } from '../../../store/hooks';
import { addSubmission } from '../../../store/slices/formSlice';
import { formSchema, type FormValues } from '../../../utils/validation';
import { convertFileToBase64 } from '../../../utils/convertFileToBase64';

interface ControlledFormProps {
  onClose: () => void;
  countries: Country[];
}

const ControlledForm = ({ onClose, countries }: ControlledFormProps) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: FormValues) => {
    let profilePictureBase64: string | null = null;

    if (data.profilePicture && data.profilePicture.length > 0) {
      const file = data.profilePicture[0];
      profilePictureBase64 = await convertFileToBase64(file);
    }

    const formData = {
      name: data.name,
      age: data.age,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      gender: data.gender,
      acceptTerms: data.acceptTerms,
      profilePicture: profilePictureBase64,
      country: data.country,
      createdAt: new Date().toISOString(),
      formType: 'controlled' as const,
    };

    dispatch(addSubmission(formData));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <FormFields
        register={register}
        errors={errors}
        watch={watch}
        countries={countries}
      />

      {errors.root && (
        <div className="error-message form-error">{errors.root.message}</div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="btn-primary"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ControlledForm;
