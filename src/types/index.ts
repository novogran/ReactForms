export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  acceptTerms: boolean;
  profilePicture: string | null;
  country: string;
  createdAt: string;
  formType: 'uncontrolled' | 'controlled';
}

export interface Country {
  code: string;
  name: string;
}

export type ModalType = 'uncontrolled' | 'controlled' | null;

export interface FormValues {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  acceptTerms: boolean;
  profilePicture: File;
  country: string;
}
