import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PlusCircle, 
  Lightbulb, 
  Activity, 
  Plus,
  Trash2
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    transactions, 
    savingsGoals, 
    addTransaction, 
    deleteTransaction, 
    addSavingsContribution,
    financialMetrics,
    adminSettings 
  } = useFinance();

  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('Food');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');

  // Savings contribution modal helper
  const [contribAmt, setContribAmt] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(savingsGoals[0]?.id || '');

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amt) return;
    
    addTransaction({
      date: new Date().toISOString().split('T')[0],
      category: cat,
      description: desc,
      amount: parseFloat(amt),
      type: txType
    });

    setDesc('');
    setAmt('');
  };

  const handleSavingsContrib = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribAmt || !selectedGoalId) return;
    addSavingsContribution(selectedGoalId, parseFloat(contribAmt));
    setContribAmt('');
  };

  // Group transactions by category to show progress bars
  const categoryExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  // Simple category limit approximations based on budgetLimit
  const getCategoryLimit = (category: string) => {
    const totalCap = adminSettings.budgetLimit;
    switch (category) {
      case 'Housing': return totalCap * 0.5; // 50% max
      case 'Food': return totalCap * 0.15;   // 15% max
      case 'Entertainment': return totalCap * 0.1; // 10% max
      case 'Transport': return totalCap * 0.1;
      case 'Health': return totalCap * 0.08;
      default: return totalCap * 0.1;
    }
  };

  const categories = ['Housing', 'Food', 'Entertainment', 'Transport', 'Health', 'Shopping', 'Other'];

  // Financial Health Score color selector
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'var(--accent-teal)';
    if (score >= 50) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  // Dynamic Circular Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (financialMetrics.healthScore / 100) * circumference;

  return (
    <div className="page-container animate-fade-in">
      
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Operations Control</h1>
          <p className="section-subtitle">Real-time telemetry of your financial posture.</p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-color)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          Budget Limit: <strong style={{ color: 'var(--text-primary)' }}>${adminSettings.budgetLimit.toFixed(0)}</strong>
        </div>
      </div>

      {/* Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        
        {/* Card 1: Balance & Income */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Remaining Balance
              </span>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-teal)' }}>
                <Wallet size={18} />
              </div>
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ${financialMetrics.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', marginTop: '1rem' }}>
            <TrendingUp size={14} style={{ color: 'var(--accent-teal)' }} />
            <span>Monthly Income: <strong style={{ color: '#fff' }}>${financialMetrics.totalIncome.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Monthly Spending
              </span>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>
                <TrendingDown size={18} />
              </div>
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ${financialMetrics.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          
          {/* Progress bar vs Budget Limit */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              <span>Vs Limit Cap (${adminSettings.budgetLimit})</span>
              <span>{Math.round((financialMetrics.totalExpenses / adminSettings.budgetLimit) * 100)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (financialMetrics.totalExpenses / adminSettings.budgetLimit) * 100)}%`,
                background: financialMetrics.totalExpenses > adminSettings.budgetLimit ? 'var(--accent-rose)' : 'linear-gradient(to right, var(--accent-teal), var(--accent-cyan))',
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Card 3: Savings Tracker */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Savings Index
              </span>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-purple)' }}>
                <Activity size={18} />
              </div>
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {financialMetrics.savingsRate}% <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>rate</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Active Goals Saved:</span>
              <strong style={{ color: '#fff' }}>
                ${savingsGoals.reduce((sum, g) => sum + g.current, 0).toLocaleString()} / ${savingsGoals.reduce((sum, g) => sum + g.target, 0).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Health, Forms & Transactions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }} className="dashboard-grid-1">
        
        {/* Left Section: Health Score + AI Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Health Score Panel */}
          <div className="glass-card health-score-container" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '2rem', alignItems: 'center' }}>
            {/* SVG Circle Gauge */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                {/* Track circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="8"
                />
                {/* Score gauge circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={getHealthScoreColor(financialMetrics.healthScore)}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              {/* Core score text overlay */}
              <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{financialMetrics.healthScore}</span>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Health score</span>
              </div>
            </div>

            {/* Health Description */}
            <div>
              <div className="badge badge-teal" style={{ 
                color: getHealthScoreColor(financialMetrics.healthScore), 
                borderColor: getHealthScoreColor(financialMetrics.healthScore),
                background: `${getHealthScoreColor(financialMetrics.healthScore)}10`,
                marginBottom: '0.75rem' 
              }}>
                {financialMetrics.healthScore >= 80 ? 'Excellent' : financialMetrics.healthScore >= 50 ? 'Stable' : 'Vulnerable'}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Financial Wellness Matrix</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Your index is computed via budget ceiling adherence, asset accumulation (savings goals progress), and fixed-income surplus. Keep your index above 80 to maintain strong fiscal health.
              </p>
            </div>
          </div>

          {/* Recommendations Panel */}
          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={18} style={{ color: 'var(--accent-amber)' }} />
              <span>AI Recommendations & Forecasts</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {financialMetrics.recommendations.map((rec, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  color: rec.includes('🚨') || rec.includes('⚠️') ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                  <div style={{ marginTop: '2px' }}>💡</div>
                  <div>{rec}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section: Add Transaction & Savings contribution forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Quick Expense Add */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={18} style={{ color: 'var(--accent-teal)' }} />
              <span>Quick Transaction Entry</span>
            </h3>
            <form onSubmit={handleAddTx}>
              
              {/* Type Switcher */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                marginBottom: '1rem',
                background: 'rgba(0,0,0,0.2)',
                padding: '0.2rem',
                borderRadius: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => { setTxType('expense'); setCat('Food'); }}
                  style={{
                    padding: '0.4rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: txType === 'expense' ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: txType === 'expense' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => { setTxType('income'); setCat('Salary'); }}
                  style={{
                    padding: '0.4rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: txType === 'income' ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: txType === 'income' ? 'var(--accent-teal)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  Income
                </button>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tx-desc">Description</label>
                <input
                  id="tx-desc"
                  type="text"
                  placeholder="e.g. Target Grocery Run"
                  className="form-input"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="tx-amt">Amount ($)</label>
                  <input
                    id="tx-amt"
                    type="number"
                    step="0.01"
                    placeholder="25.50"
                    className="form-input"
                    value={amt}
                    onChange={(e) => setAmt(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tx-cat">Category</label>
                  {txType === 'expense' ? (
                    <select
                      id="tx-cat"
                      className="form-select"
                      value={cat}
                      onChange={(e) => setCat(e.target.value)}
                    >
                      {categories.filter(c => c !== 'Salary').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      id="tx-cat"
                      className="form-select"
                      value={cat}
                      onChange={(e) => setCat(e.target.value)}
                    >
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <Plus size={16} />
                <span>Post Transaction</span>
              </button>
            </form>
          </div>

          {/* Quick Savings Goal contribution */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={18} style={{ color: 'var(--accent-purple)' }} />
              <span>Fund Savings Goals</span>
            </h3>
            <form onSubmit={handleSavingsContrib}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="sav-goal">Target Goal</label>
                <select
                  id="sav-goal"
                  className="form-select"
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                >
                  {savingsGoals.map(g => (
                    <option key={g.id} value={g.id}>{g.name} (${g.current}/${g.target})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" htmlFor="sav-amt">Contribution Amount ($)</label>
                <input
                  id="sav-amt"
                  type="number"
                  placeholder="e.g. 150"
                  className="form-input"
                  value={contribAmt}
                  onChange={(e) => setContribAmt(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                style={{ width: '100%', borderColor: 'rgba(99, 102, 241, 0.4)', color: 'var(--accent-purple)' }}
              >
                <Plus size={16} />
                <span>Allocate Capital</span>
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Bottom Grid: Category Budgets & Recent Ledger Ledger */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '0.9fr 1.15fr',
        gap: '1.5rem'
      }} className="dashboard-grid-2">
        
        {/* Expense Category Budgets */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Expense Categories Allocation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {categories.filter(c => c !== 'Salary').map(catName => {
              const spent = categoryExpenses[catName] || 0;
              const limit = getCategoryLimit(catName);
              const percentage = Math.round((spent / limit) * 100);
              
              return (
                <div key={catName}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 550 }}>{catName}</span>
                    <span style={{ color: spent > limit ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
                      ${spent.toFixed(0)} <span style={{ color: 'var(--text-muted)' }}>/ ${limit.toFixed(0)}</span>
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, percentage)}%`,
                      background: spent > limit ? 'var(--accent-rose)' : 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))',
                      borderRadius: '3px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions Ledger */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Real-time General Ledger</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '360px', paddingRight: '0.25rem' }}>
            {transactions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
                No active transactions recorded yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {transactions.map(tx => (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: 'var(--border-radius-sm)',
                      transition: 'var(--transition-fast)'
                    }}
                    className="ledger-row"
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '0.15rem' }}>
                        {tx.description}
                      </h4>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tx.date}</span>
                        <span className={`badge ${tx.type === 'income' ? 'badge-teal' : 'badge-cyan'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                          {tx.category}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: tx.type === 'income' ? 'var(--accent-teal)' : '#fff'
                      }}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          borderRadius: '4px',
                          transition: 'var(--transition-fast)'
                        }}
                        className="delete-tx-btn"
                        title="Void transaction"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 990px) {
          .dashboard-grid-1 {
            grid-template-columns: 1fr !important;
          }
          .dashboard-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .health-score-container {
            grid-template-columns: 1fr !important;
            justify-items: center;
            text-align: center;
          }
        }
        .ledger-row:hover {
          background: rgba(255,255,255,0.03) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        .delete-tx-btn:hover {
          color: var(--accent-rose) !important;
          background: rgba(244, 63, 94, 0.1) !important;
        }
      `}} />
    </div>
  );
};
