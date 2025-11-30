import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PredictorPage from './pages/PredictorPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/predict" 
              element={
                <PrivateRoute>
                  <PredictorPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;