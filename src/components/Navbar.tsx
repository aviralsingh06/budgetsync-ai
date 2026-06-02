import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Menu, X, ArrowLeftRight, Clock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, currentPage, isNavOpen, setNavOpen, login } = useFinance();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Financial Control';
      case 'analytics': return 'Investment & Spending Analytics';
      case 'chatbot': return 'AI Advisor Core';
      case 'reports': return 'Ledger & Audit Reports';
      case 'admin': return 'Fintech Orchestrator';
      default: return 'BudgetSync AI';
    }
  };

  const handleRoleToggle = () => {
    const targetRole = user.role === 'admin' ? 'user' : 'admin';
    login(user.email, targetRole);
  };

  return (
    <header 
      style={{
        height: '70px',
        background: 'rgba(9, 9, 11, 0.5)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 900,
      }}
      className="glass-navbar"
    >
      {/* Left Area: Title and Hamburger Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setNavOpen(!isNavOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'none', // Shown in media queries
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="mobile-hamburger"
        >
          {isNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
            {getPageTitle()}
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }} className="mobile-hide">
            BudgetSync v1.0.0 // AI active
          </span>
        </div>
      </div>

      {/* Right Area: Metadata, Time, and Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Digital Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          fontFamily: 'monospace'
        }} className="mobile-hide">
          <Clock size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span>{time}</span>
        </div>

        {/* User Role Swap Toggler (Premium Developer Utility for Testing) */}
        <button
          onClick={handleRoleToggle}
          title={`Switch account mode to ${user.role === 'admin' ? 'Regular User' : 'System Admin'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '20px',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            background: 'rgba(99, 102, 241, 0.05)',
            color: 'var(--accent-purple)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'var(--transition-fast)'
          }}
          className="role-switch-btn"
        >
          <ArrowLeftRight size={13} />
          <span>Test as {user.role === 'admin' ? 'User' : 'Admin'}</span>
        </button>

        {/* Active Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-hide">
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-teal)',
            boxShadow: '0 0 10px var(--accent-teal)',
            animation: 'pulseGlow 2s infinite'
          }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 650, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Sync
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .mobile-hamburger {
            display: flex !important;
          }
          .mobile-hide {
            display: none !important;
          }
          .glass-navbar {
            padding: 0 1rem !important;
            position: fixed !important;
            top: 0;
            left: 0;
            width: 100vw;
            border-bottom: 1px solid var(--border-color) !important;
          }
        }
        .role-switch-btn:hover {
          background: rgba(99, 102, 241, 0.15) !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
          transform: translateY(-1px);
        }
      `}} />
    </header>
  );
};
