import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubmissionCard from './SubmissionCard';
import type { FormData } from '../../types';

describe('SubmissionCard', () => {
  const mockData: FormData = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
    gender: 'male',
    country: 'United States',
    createdAt: '2023-01-01T00:00:00.000Z',
    formType: 'controlled',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    acceptTerms: true,
    id: '',
    profilePicture: null,
  };

  it('рендерит данные карточки', () => {
    render(<SubmissionCard data={mockData} isNew={false} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('controlled')).toBeInTheDocument();
  });

  it('добавляет класс new-submission когда isNew=true', () => {
    const { container } = render(
      <SubmissionCard data={mockData} isNew={true} />
    );

    expect(container.firstChild).toHaveClass('new-submission');
  });

  it('не добавляет класс new-submission когда isNew=false', () => {
    const { container } = render(
      <SubmissionCard data={mockData} isNew={false} />
    );

    expect(container.firstChild).not.toHaveClass('new-submission');
  });

  it('отображает картинку когда есть profilePicture', () => {
    const dataWithImage = {
      ...mockData,
      profilePicture: 'data:image/png;base64,test123',
    };

    render(<SubmissionCard data={dataWithImage} isNew={false} />);

    const image = screen.getByAltText('Profile');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'data:image/png;base64,test123');
  });

  it('не отображает картинку когда нет profilePicture', () => {
    render(<SubmissionCard data={mockData} isNew={false} />);

    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  });

  it('отображает текст Submitted', () => {
    render(<SubmissionCard data={mockData} isNew={false} />);

    expect(screen.getByText(/Submitted:/)).toBeInTheDocument();
  });
});
