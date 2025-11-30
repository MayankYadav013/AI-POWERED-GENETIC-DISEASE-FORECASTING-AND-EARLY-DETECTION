import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/predict');
    } catch (err) {
      setError(err?.response?.data?.msg || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-box">
        <h2>Welcome back</h2>
        <p className="form-subtitle">Sign in to access the genetic risk predictor.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary btn-block">Log In</button>
        </form>
        <p className="auth-footer">
          Need an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
