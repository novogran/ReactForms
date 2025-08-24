import { useAppSelector } from '../store/hooks';
import SubmissionCard from './SubmissionCard/SubmissionCard';

const MainPage = () => {
  const { submissions, newSubmissionId } = useAppSelector(
    (state) => state.form
  );

  return (
    <div className="main-page">
      <header className="page-header">
        <h1>Form Submissions</h1>
        <p>View all submitted forms below</p>
      </header>

      <div className="submissions-grid">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            data={submission}
            isNew={submission.id === newSubmissionId}
          />
        ))}

        {submissions.length === 0 && (
          <div className="empty-state">
            <p>No submissions yet. Click the buttons above to create forms!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
