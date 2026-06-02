import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Chatbot } from './pages/Chatbot';
import { Reports } from './pages/Reports';
import { Admin } from './pages/Admin';
import { Megaphone, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, currentPage } = useFinance();
  const [bannerText, setBannerText] = useState<string | null>(null);

  // Sync Global System Notice banner from localStorage
  const checkBanner = () => {
    const banner = localStorage.getItem('budgetsync_banner');
    setBannerText(banner);
  };

  useEffect(() => {
    checkBanner();
    window.addEventListener('budgetsync_banner_update', checkBanner);
    return () => {
      window.removeEventListener('budgetsync_banner_update', checkBanner);
    };
  }, []);

  const handleCloseBanner = () => {
    localStorage.removeItem('budgetsync_banner');
    setBannerText(null);
  };

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'chatbot':
        return <Chatbot />;
      case 'reports':
        return <Reports />;
      case 'admin':
        return <Admin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        
        {/* Dynamic Global Notification Banner */}
        {bannerText && (
          <div style={{
            background: 'linear-gradient(90deg, var(--accent-purple) 0%, var(--accent-rose) 100%)',
            color: '#fff',
            padding: '0.65rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Megaphone size={16} />
              <span>{bannerText}</span>
            </div>
            <button 
              onClick={handleCloseBanner}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.2rem',
                borderRadius: '50%',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >
              <X size={15} />
            </button>
          </div>
        )}

        <Navbar />
        {renderPage()}
      </div>
    </div>
  );
};

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
