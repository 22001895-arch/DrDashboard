import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DoctorDashboard } from './components/DoctorDashboard';
import { LoginPage } from './components/LoginPage';

function AppContent() {
  const { doctor } = useAuth();

  if (!doctor) {
    return <LoginPage />;
  }

  return (
    <AppProvider>
      <DoctorDashboard />
    </AppProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
