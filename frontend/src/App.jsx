import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex">
          <SidebarWrapper />
          <main className="flex-1 min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-6">
              <AppRoutes />
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
