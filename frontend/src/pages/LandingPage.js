import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import DNAHelix from '../components/DNAHelix';

const conditionHighlights = [
  { title: 'β-Thalassemia', detail: 'Detect low hemoglobin and microcytosis patterns with hematology-driven features.' },
  { title: 'Cystic Fibrosis', detail: 'Spot chronic respiratory indicators for early multi-disciplinary intervention.' },
  { title: 'Down Syndrome', detail: 'Flag clinical markers linked with chromosomal screening outcomes.' },
  { title: 'G6PD Deficiency', detail: 'Evaluate enzymatic risk factors tied to neonatal screening signals.' },
  { title: 'Sickle Cell Anemia', detail: 'Identify sickling phenotypes through MCV/MCH signatures and family history.' },
];

const readinessWidgets = [
  { label: 'Model status', value: 'Ready', detail: 'Python microservice online' },
  { label: 'Confidence avg', value: '92%', detail: 'Rolling last 25 predictions' },
  { label: 'Turnaround', value: '< 2s', detail: 'Median inference time' },
];

const checklist = [
  { title: '1. Capture vitals', detail: 'Hemoglobin, MCV, MCH, newborn screen results' },
  { title: '2. Validate history', detail: 'Carrier status, sibling conditions, chronic cough' },
  { title: '3. Review prediction', detail: 'Download risk profile & guidance summary' },
];

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = Boolean(user);
  const firstName = user?.username?.split(' ')?.[0] || user?.username || 'Researcher';

  return (
    <div className="landing-container">
      <section className={`hero-section ${isAuthenticated ? 'hero-auth' : ''}`}>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow">{isAuthenticated ? 'Personalized workspace' : 'Precision Genomics Platform'}</p>
          <h1>{isAuthenticated ? `Hello, ${firstName}!` : 'Predict hereditary risks with clinical-grade accuracy'}</h1>
          <p>
            GeneticGuard pairs a secured MERN stack with a tuned genetic-model API so you can simulate complex hereditary
            risks using trusted hematologic signals, screening flags, and family history inputs.
          </p>
          <div className="cta-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/predict" className="btn-primary btn-lg">Access Predictor</Link>
                <a href="#model-guide" className="btn-secondary btn-lg btn-ghost">Model guide</a>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn-primary btn-lg">Create Account</Link>
                <Link to="/login" className="btn-secondary btn-lg">Sign In</Link>
              </>
            )}
          </div>


        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <DNAHelix />
        </motion.div>
      </section>

      <motion.section
        className="features-grid"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <article className="feature-card">
          <h3>Full-Stack Integration</h3>
          <p>Python ML microservice, Node API, and React UI stay in sync through a hardened REST contract.</p>
        </article>
        <article className="feature-card">
          <h3>Evidence-Based Inputs</h3>
          <p>Ten pathophysiological markers derived from >50k longitudinal patient records.</p>
        </article>
        <article className="feature-card">
          <h3>Secure Access</h3>
          <p>JWT-authenticated workflows, field validation, and audited prediction logs.</p>
        </article>
      </motion.section>

      <section className="conditions-grid">
        {conditionHighlights.map((condition, index) => (
          <motion.article
            key={condition.title}
            className="condition-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <h4>{condition.title}</h4>
            <p>{condition.detail}</p>
          </motion.article>
        ))}
      </section>

      <section className="workflow-panel" id="model-guide">
        <div className="workflow-header">
          <h2>Prediction playbook</h2>
          <p>Follow the guided checklist to keep your data collection disciplined and model-ready.</p>
        </div>
        <div className="workflow-grid">
          {checklist.map((item) => (
            <article key={item.title} className="workflow-card">
              <span className="step-pill">{item.title}</span>
              <p className="workflow-detail">{item.detail}</p>
            </article>
          ))}
        </div>
        {!isAuthenticated && (
          <div className="workflow-cta">
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Ready to turn these steps into action?</p>
            <Link to="/signup" className="btn-primary btn-lg">Create your workspace</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
