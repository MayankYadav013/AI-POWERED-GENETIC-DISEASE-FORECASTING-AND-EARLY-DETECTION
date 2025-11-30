import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} GeneticGuard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;