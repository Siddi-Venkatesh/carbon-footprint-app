import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/calculator', label: 'Calculator' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/history', label: 'History' },
    { path: '/challenges', label: 'Challenges' },
    { path: '/education', label: 'Education' },
  ];

  return (
    <nav style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 0',
      marginBottom: '2rem',
      borderBottom: '1px solid var(--bg-tertiary)'
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        EcoAssist 🌿
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path} 
              to={link.path}
              style={{
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
