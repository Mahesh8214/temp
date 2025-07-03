
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DriveProvider } from './contexts/DriveContext';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SharedFilePage from './pages/SharedFilePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shared/:fileId" element={<SharedFilePage />} />
          <Route 
            path="/*"
            element={
              <PrivateRoute>
                <DriveProvider>
                   <Routes>
                      <Route path="/folder/:folderId/*" element={<Dashboard />} />
                      <Route path="*" element={<Dashboard />} />
                   </Routes>
                </DriveProvider>
              </PrivateRoute>
            }
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-drive-gray-100 dark:bg-drive-gray-950">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};


export default App;
