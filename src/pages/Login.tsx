import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  BrainCircuit,
  Lock,
  Mail,
  ArrowRight,
  Cpu,
  BarChart3,
  Receipt
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useFinance();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: Cpu,
      title: 'AI-Powered Budget Advisory',
      desc:
        'Track spending, monitor savings, and receive intelligent recommendations for smarter financial decisions.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Financial Analytics',
      desc:
        'Visualize income, expenses, and budget trends through beautiful and easy-to-understand analytics.'
    },
    {
      icon: Receipt,
      title: 'Expense Reports & Insights',
      desc:
        'Organize transactions, review spending patterns, and generate detailed financial summaries.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    // Temporary login
    setTimeout(() => {
      login(email, 'user');
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), #09090b'
      }}
    >
      {/* Blur Effects */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '300px',
          height: '300px',
          background: 'var(--accent-purple-glow)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 0
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '20%',
          width: '350px',
          height: '350px',
          background: 'var(--accent-cyan-glow)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          zIndex: 0
        }}
      />

      {/* Main Card */}
      <div
        style={{
          width: '1000px',
          maxWidth: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(18,18,22,0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          zIndex: 1
        }}
        className="login-card-container"
      >
        {/* LEFT SIDE */}
        <div
          style={{
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(255,255,255,0.04)'
          }}
          className="login-info-panel"
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-teal) 0%, var(--accent-cyan) 100%)',
                width: '45px',
                height: '45px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BrainCircuit size={22} color="#000" />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: '1.5rem'
                }}
              >
                BudgetSync{' '}
                <span className="text-gradient-teal-cyan">
                  AI
                </span>
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}
              >
                PERSONAL FINANCE MANAGER
              </p>
            </div>
          </div>

          {/* Slider */}
          <div style={{ margin: '3rem 0' }}>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              {React.createElement(
                slides[activeSlide].icon,
                {
                  size: 26
                }
              )}

              <h3
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 700
                }}
              >
                {slides[activeSlide].title}
              </h3>
            </div>

            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                minHeight: '80px'
              }}
            >
              {slides[activeSlide].desc}
            </p>

            {/* Slider Dots */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1.5rem'
              }}
            >
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setActiveSlide(idx)
                  }
                  style={{
                    width:
                      idx === activeSlide
                        ? '24px'
                        : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      idx === activeSlide
                        ? 'var(--accent-cyan)'
                        : 'rgba(255,255,255,0.15)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '2rem'
            }}
          >
            Login to manage your expenses,
            savings, budget planning and
            financial insights.
          </p>

          {error && (
            <div
              style={{
                background:
                  'rgba(244,63,94,0.1)',
                border:
                  '1px solid rgba(244,63,94,0.2)',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                color: '#ff6b81',
                marginBottom: '1rem'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label
                className="form-label"
                htmlFor="email"
              >
                Email Address
              </label>

              <div
                style={{ position: 'relative' }}
              >
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform:
                      'translateY(-50%)'
                  }}
                />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem'
                  }}
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div
              className="form-group"
              style={{
                marginBottom: '2rem'
              }}
            >
              <label
                className="form-label"
                htmlFor="password"
              >
                Password
              </label>

              <div
                style={{ position: 'relative' }}
              >
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform:
                      'translateY(-50%)'
                  }}
                />

                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem'
                  }}
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Signup Text */}
          <div
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              color:
                'var(--text-secondary)'
            }}
          >
            Don’t have an account?{' '}
            <span
              style={{
                color:
                  'var(--accent-cyan)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Create Account
            </span>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (max-width: 820px) {
            .login-card-container {
              grid-template-columns: 1fr !important;
            }

            .login-info-panel {
              border-right: none !important;
              border-bottom: 1px solid rgba(255,255,255,0.05);
            }
          }
        `
        }}
      />
    </div>
  );
};