import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(formData.username, formData.email, formData.password);
      navigate('/predict');
    } catch (err) {
      setError(err?.response?.data?.msg || 'Unable to create account. Please try a different email.');
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-box">
        <h2>Create your GeneticGuard account</h2>
        <p className="form-subtitle">Securely store predictions and unlock clinical-grade insights.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-username">Full name</label>
            <input
              id="signup-username"
              type="text"
              name="username"
              minLength={2}
              maxLength={60}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary btn-block">Create Account</button>
        </form>
        <p className="auth-footer">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;
