import type { FormData } from '../../types';

interface SubmissionCardProps {
  data: FormData;
  isNew: boolean;
}

const SubmissionCard = ({ data, isNew }: SubmissionCardProps) => {
  return (
    <div className={`submission-card ${isNew ? 'new-submission' : ''}`}>
      <div className="card-header">
        <h3>{data.name}</h3>
        <span className={`form-type ${data.formType}`}>{data.formType}</span>
      </div>

      <div className="card-content">
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Age:</strong> {data.age}
        </p>
        <p>
          <strong>Gender:</strong> {data.gender}
        </p>
        <p>
          <strong>Country:</strong> {data.country}
        </p>
        <p>
          <strong>Submitted:</strong>{' '}
          {new Date(data.createdAt).toLocaleDateString()}
        </p>

        {data.profilePicture && (
          <div className="profile-picture">
            <img src={data.profilePicture} alt="Profile" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
