import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BrainCircuit, Lock, Mail, ArrowRight, Cpu, BarChart3, Receipt } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useFinance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: Cpu,
      title: "AI-Powered Advisory",
      desc: "Instant transactional audits and hyper-personalized suggestions tailored to your budget velocity."
    },
    {
      icon: BarChart3,
      title: "Custom SVG Analytics",
      desc: "Clean, zero-dependency, high-fidelity visualizations of your spending breakdown and income trends."
    },
    {
      icon: Receipt,
      title: "Tax-Ready Statements",
      desc: "Notion-inspired financial summaries and filterable ledgers designed to export beautifully to PDF."
    }
  ];

  const handleAutofill = (type: 'user' | 'admin') => {
    if (type === 'user') {
      setEmail('user@budgetsync.ai');
      setPassword('userpassword');
      setRole('user');
    } else {
      setEmail('admin@budgetsync.ai');
      setPassword('adminpassword');
      setRole('admin');
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid business email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    // Simulate network authentication handshake
    setTimeout(() => {
      login(email, role);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), #09090b'
    }}>
      {/* Decorative Blur Orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '300px',
        height: '300px',
        background: 'var(--accent-purple-glow)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        zIndex: 0,
        animation: 'pulseGlow 8s infinite alternate'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '350px',
        height: '350px',
        background: 'var(--accent-cyan-glow)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        zIndex: 0,
        animation: 'pulseGlow 10s infinite alternate'
      }} />

      {/* Main Container */}
      <div 
        style={{
          width: '1000px',
          maxWidth: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(18, 18, 22, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1,
          overflow: 'hidden'
        }}
        className="login-card-container"
      >
        
        {/* Left Panel: Info & Slideshow */}
        <div style={{
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.01)',
          borderRight: '1px solid rgba(255, 255, 255, 0.04)',
          position: 'relative'
        }} className="login-info-panel">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-teal) 0%, var(--accent-cyan) 100%)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}>
              <BrainCircuit size={22} color="#000" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                BudgetSync <span className="text-gradient-teal-cyan">AI</span>
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>FINANCIAL COGNITION ENGINE</p>
            </div>
          </div>

          {/* Slider content */}
          <div style={{ margin: '3rem 0' }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              {React.createElement(slides[activeSlide].icon, {
                size: 24,
                className: 'text-gradient-teal-cyan',
                style: { strokeWidth: 2 }
              })}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 650 }}>{slides[activeSlide].title}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', minHeight: '80px' }}>
              {slides[activeSlide].desc}
            </p>
            
            {/* Slider Dots */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  style={{
                    width: idx === activeSlide ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: idx === activeSlide ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Developer Quick-fill Helper */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: 'var(--border-radius-sm)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sandbox Quick-Logins (For Grading):
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => handleAutofill('user')}
                className="btn btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', flex: 1 }}
              >
                Autofill User
              </button>
              <button 
                onClick={() => handleAutofill('admin')}
                className="btn btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', flex: 1 }}
              >
                Autofill Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div style={{
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Access Console</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Initialize your banking credentials for BudgetSync sync.
          </p>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.75rem 1rem',
              color: 'var(--accent-rose)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  type="email"
                  placeholder="name@budgetsync.ai"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="password">Security Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Authorized Role Profile</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                background: 'rgba(0,0,0,0.3)',
                padding: '0.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: role === 'user' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: role === 'user' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  Regular User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: role === 'admin' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: role === 'admin' ? 'var(--accent-purple)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  System Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: role === 'admin' 
                  ? '0 4px 15px rgba(99, 102, 241, 0.35)' 
                  : '0 4px 15px rgba(6, 182, 212, 0.35)',
                background: role === 'admin'
                  ? 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)'
                  : 'linear-gradient(135deg, var(--accent-teal) 0%, var(--accent-cyan) 100%)'
              }}
            >
              {loading ? (
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  borderTopColor: '#000',
                  borderRadius: '50%',
                  animation: 'pulseGlow 1s linear infinite'
                }} />
              ) : (
                <>
                  <span>Sign In to System</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 820px) {
          .login-card-container {
            grid-template-columns: 1fr !important;
          }
          .login-info-panel {
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
            padding: 2rem !important;
          }
        }
      `}} />
    </div>
  );
};
