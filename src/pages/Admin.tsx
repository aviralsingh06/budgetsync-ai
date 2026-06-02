import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Sliders, Cpu, Activity, Database, AlertCircle, RefreshCw, Radio, Bell } from 'lucide-react';

export const Admin: React.FC = () => {
  const { adminSettings, updateAdminSettings, transactions, user, setPage } = useFinance();
  const [limit, setLimit] = useState(adminSettings.budgetLimit.toString());
  const [rule, setRule] = useState(adminSettings.recommendationRule);
  const [ratio, setRatio] = useState(adminSettings.savingsGoalRatio.toString());
  const [notice, setNotice] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="page-container animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <AlertCircle size={48} style={{ color: 'var(--accent-rose)', marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Unauthorized Authorization</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Your account profile does not possess the requisite clearance to access this control deck.
          </p>
          <button onClick={() => setPage('dashboard')} className="btn btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({
      budgetLimit: parseFloat(limit) || 3500,
      recommendationRule: rule as 'strict' | 'moderate',
      savingsGoalRatio: parseFloat(ratio) || 20
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleClearCache = () => {
    if (window.confirm("Confirm reset of all ledger, goals, and session cache back to sandbox default settings?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const dispatchNotice = () => {
    if (!notice.trim()) return;
    // Broadcast notification banner by inserting into localStorage
    localStorage.setItem('budgetsync_banner', notice);
    // Custom event to alert App.tsx to reload its banner state
    window.dispatchEvent(new Event('budgetsync_banner_update'));
    setNotice('');
    alert(`Global notice dispatched: "${notice}"`);
  };

  return (
    <div className="page-container animate-fade-in">
      
      {/* Page Title */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Fintech System Orchestrator</h1>
          <p className="section-subtitle">Manage global AI recommendation rules, platform thresholds, and sandbox cache.</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }} className="admin-grid-top">
        
        {/* Settings Panel */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span>AI recommendation thresholds</span>
          </h3>

          {saveSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.75rem 1rem',
              color: 'var(--accent-teal)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              ✓ Threshold rules updated successfully. Applied to User Ledgers.
            </div>
          )}

          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label className="form-label" htmlFor="budget-lim">Global Monthly Budget Limit ($)</label>
              <input
                id="budget-lim"
                type="number"
                className="form-input"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Triggers visual alarms and decreases health scores on the dashboard when exceeded.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="recommendation-sev">AI Recommendation Intensity</label>
              <select
                id="recommendation-sev"
                className="form-select"
                value={rule}
                onChange={(e) => setRule(e.target.value)}
              >
                <option value="moderate">Moderate Suggestions (Advice)</option>
                <option value="strict">Strict Safeguards (Restrictive alerts)</option>
              </select>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Swaps advisory criteria text formatting in user dashboards and chatbot engines.
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="savings-goal-pct">Target Savings Ratio Percentage (%)</label>
              <input
                id="savings-goal-pct"
                type="number"
                className="form-input"
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Commit Global Configurations
            </button>
          </form>
        </div>

        {/* Global Broadcast notice dispatch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} style={{ color: 'var(--accent-purple)' }} />
              <span>Broadcast Banner Dispatcher</span>
            </h3>
            <div className="form-group">
              <label className="form-label" htmlFor="banner-text">Notice Banner Message</label>
              <input
                id="banner-text"
                type="text"
                placeholder="e.g. Server maintenance scheduled at 02:00 AM UTC"
                className="form-input"
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
              />
            </div>
            <button
              onClick={dispatchNotice}
              className="btn btn-secondary"
              style={{ width: '100%', borderColor: 'rgba(99, 102, 241, 0.4)', color: 'var(--accent-purple)', marginTop: '0.5rem' }}
            >
              Dispatch System Notice
            </button>
          </div>

          {/* Sandbox utility reset */}
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={17} style={{ color: 'var(--accent-rose)' }} />
                <span>Sandbox Data Integrity Operations</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Reset local storage ledger records, AI prompts chat sessions, and goal balances to default states. This helps clean up test entries instantly.
              </p>
            </div>
            <button
              onClick={handleClearCache}
              className="btn btn-danger"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Reset Sandbox Database Cache
            </button>
          </div>

        </div>

      </div>

      {/* System Telemetry & Heartbeat stats */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio size={18} style={{ color: 'var(--accent-teal)', animation: 'pulseGlow 2s infinite' }} />
          <span>Real-time System Telemetry</span>
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }} className="admin-telemetry-grid">
          
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--border-radius-sm)', padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Memory Load CPU</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>42.8%</span>
              <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--border-radius-sm)', padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Database Node</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Healthy</span>
              <Database size={18} style={{ color: 'var(--accent-teal)' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--border-radius-sm)', padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Transactions Count</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{transactions.length} synced</span>
              <Activity size={18} style={{ color: 'var(--accent-purple)' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--border-radius-sm)', padding: '1rem 1.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ledger Sync Rate</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>99.98%</span>
              <Activity size={18} style={{ color: 'var(--accent-teal)' }} />
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 820px) {
          .admin-grid-top {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
};
