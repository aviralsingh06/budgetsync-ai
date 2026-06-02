import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LayoutDashboard, 
  PieChart, 
  MessageSquare, 
  FileText, 
  ShieldAlert, 
  LogOut,
  BrainCircuit
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, currentPage, setPage, logout, isNavOpen, setNavOpen } = useFinance();

  if (!user) return null;

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', name: 'Analytics', icon: PieChart },
    { id: 'chatbot', name: 'AI Assistant', icon: MessageSquare },
    { id: 'reports', name: 'Reports', icon: FileText },
  ];

  // Add Admin Dashboard conditionally
  if (user.role === 'admin') {
    menuItems.push({ id: 'admin', name: 'Admin Panel', icon: ShieldAlert });
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isNavOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            transition: 'opacity 0.3s ease'
          }}
          onClick={() => setNavOpen(false)}
        />
      )}

      <aside 
        style={{
          width: '260px',
          background: 'rgba(9, 9, 11, 0.95)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 999,
          padding: '1.5rem 1rem',
          transition: 'transform 0.3s ease',
        }}
        className={isNavOpen ? 'mobile-sidebar-open' : 'mobile-sidebar-closed'}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-teal) 0%, var(--accent-cyan) 100%)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
          }}>
            <BrainCircuit size={20} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 50%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BudgetSync AI</h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 650, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fintech OS</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  textAlign: 'left',
                  transition: 'var(--transition-fast)',
                  position: 'relative'
                }}
                className="sidebar-btn"
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    height: '60%',
                    width: '3px',
                    borderRadius: '0 4px 4px 0',
                    background: 'linear-gradient(to bottom, var(--accent-teal), var(--accent-cyan))'
                  }} />
                )}
                <Icon size={18} style={{ color: isActive ? 'var(--accent-cyan)' : 'inherit', transition: 'var(--transition-fast)' }} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--accent-cyan)'
            }}>
              {user.username.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</p>
              <span style={{ 
                fontSize: '0.7rem', 
                color: user.role === 'admin' ? 'var(--accent-purple)' : 'var(--text-muted)', 
                fontWeight: 650, 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {user.role} Account
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              background: 'transparent',
              color: 'var(--accent-rose)',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500,
              textAlign: 'left',
              transition: 'var(--transition-fast)'
            }}
            className="sidebar-logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Inline CSS styling override to support sidebar toggle states */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            aside.mobile-sidebar-closed {
              transform: translateX(-100%);
              position: fixed;
              height: 100vh;
            }
            aside.mobile-sidebar-open {
              transform: translateX(0);
              position: fixed;
              height: 100vh;
            }
          }
          .sidebar-btn:hover {
            background: rgba(255,255,255,0.03) !important;
            color: #fff !important;
          }
          .sidebar-btn:hover svg {
            color: var(--accent-cyan) !important;
            transform: scale(1.05);
          }
          .sidebar-logout:hover {
            background: rgba(244, 63, 94, 0.08) !important;
          }
        `}} />
      </aside>
    </>
  );
};
