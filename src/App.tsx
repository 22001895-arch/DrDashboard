import { AppProvider } from './context/AppContext';
import { DoctorDashboard } from './components/DoctorDashboard';

function App() {
  return (
    <AppProvider>
      <DoctorDashboard />
    </AppProvider>
  );
}

export default App;
