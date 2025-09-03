import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './store/hooks';
import './App.css';
import Modal from './componets/Modal';
import MainPage from './componets/MainPage';
import UncontrolledForm from './componets/forms/UncontrolledForm/UncontrolledForm';
import ControlledForm from './componets/forms/ControlledForm/ControlledForm';

function AppContent() {
  const [activeModal, setActiveModal] = useState<
    'uncontrolled' | 'controlled' | null
  >(null);
  const countries = useAppSelector((state) => state.country.countries);

  const handleCloseModal = () => setActiveModal(null);

  return (
    <div className="app">
      <div className="app-header">
        <h1>Form Management System</h1>
        <div className="button-group">
          <button
            onClick={() => setActiveModal('uncontrolled')}
            className="btn-primary"
          >
            Open Uncontrolled Form
          </button>
          <button
            onClick={() => setActiveModal('controlled')}
            className="btn-primary"
          >
            Open Controlled Form
          </button>
        </div>
      </div>

      <MainPage />

      <Modal
        isOpen={activeModal === 'uncontrolled'}
        onClose={handleCloseModal}
        title="Uncontrolled Form"
      >
        <UncontrolledForm onClose={handleCloseModal} countries={countries} />
      </Modal>

      <Modal
        isOpen={activeModal === 'controlled'}
        onClose={handleCloseModal}
        title="Controlled Form (React Hook Form)"
      >
        <ControlledForm onClose={handleCloseModal} countries={countries} />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
