import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FileText, Printer, Filter, Search } from 'lucide-react';

export const Reports: React.FC = () => {
  const { transactions } = useFinance();
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const categories = ['All', 'Housing', 'Food', 'Entertainment', 'Transport', 'Health', 'Shopping', 'Salary', 'Freelance', 'Investment', 'Other'];

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter & Sort Transactions
  const filteredTxs = transactions
    .filter(tx => {
      const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
      const matchesType = filterType === 'All' || tx.type === filterType;
      const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Calculate Aggregations for Filtered Data
  const summaryIncome = filteredTxs
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const summaryExpense = filteredTxs
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const summaryNet = summaryIncome - summaryExpense;

  return (
    <div className="page-container animate-fade-in print-container">
      
      {/* Page Title & Print Trigger */}
      <div className="section-header print-hide">
        <div>
          <h1 className="section-title">Audit Ledger & Reports</h1>
          <p className="section-subtitle">Generate, filter, and export tax-ready statements and logs.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Printer size={15} />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Notion-style Document Header for Print */}
      <div className="print-only" style={{ display: 'none', marginBottom: '2.5rem', borderBottom: '2px solid #000', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#000', margin: '0 0 0.5rem 0' }}>BudgetSync AI</h1>
        <p style={{ margin: 0, color: '#333', fontSize: '0.95rem' }}>Official Financial Ledger Statement</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.85rem', color: '#555' }}>
          <span>Generated On: <strong>{new Date().toLocaleDateString()}</strong></span>
          <span>Security Level: <strong>Class-1 Encrypted Ledger</strong></span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="glass-card print-hide" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Filter size={16} style={{ color: 'var(--accent-cyan)' }} />
          <span>Ledger Filter Controls</span>
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1.2fr',
          gap: '1rem'
        }} className="filters-grid">
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="filter-type">Account Activity</label>
            <select
              id="filter-type"
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Postings</option>
              <option value="income">Inflow (Income)</option>
              <option value="expense">Outflow (Expense)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="filter-cat">Posting Category</label>
            <select
              id="filter-cat"
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="sort-field">Active Sort</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                id="sort-field"
                type="button"
                onClick={() => toggleSort('date')}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  fontSize: '0.85rem',
                  padding: '0.65rem 0.5rem',
                  borderColor: sortField === 'date' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                  color: sortField === 'date' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button
                type="button"
                onClick={() => toggleSort('amount')}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  fontSize: '0.85rem',
                  padding: '0.65rem 0.5rem',
                  borderColor: sortField === 'amount' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                  color: sortField === 'amount' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Amt {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="filter-search">Description Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="filter-search"
                type="text"
                placeholder="e.g. Starbucks..."
                className="form-input"
                style={{ width: '100%', paddingLeft: '2.3rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Aggregate summary cards of filtered items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }} className="report-summary-cards">
        <div className="glass-card print-card-outline" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Filtered Inflows</span>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--accent-teal)' }}>+${summaryIncome.toFixed(2)}</h4>
        </div>
        <div className="glass-card print-card-outline" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Filtered Outflows</span>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', color: '#fff' }}>-${summaryExpense.toFixed(2)}</h4>
        </div>
        <div className="glass-card print-card-outline" style={{ padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Net Surplus/Deficit</span>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', color: summaryNet >= 0 ? 'var(--accent-cyan)' : 'var(--accent-rose)' }}>
            {summaryNet >= 0 ? '+' : '-'}${Math.abs(summaryNet).toFixed(2)}
          </h4>
        </div>
      </div>

      {/* Ledger statement output table */}
      <div className="glass-card print-card-outline" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Table Header Section */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }} className="print-border-bottom">
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} style={{ color: 'var(--accent-teal)' }} />
            <span>Posting Ledger ({filteredTxs.length} records)</span>
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="print-hide">Scope: Live Synced Ledger</span>
        </div>

        {/* Ledger Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.92rem'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(255,255,255,0.01)',
                borderBottom: '1px solid var(--border-color)'
              }} className="print-border-bottom">
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 650 }}>Posting Date</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 650 }}>Descriptor</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 650 }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 650 }}>Audit Class</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 650, textAlign: 'right' }}>Capital Volume</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No ledger entries matching active filter configurations.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx, idx) => (
                  <tr 
                    key={tx.id} 
                    style={{ 
                      borderBottom: idx === filteredTxs.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' 
                    }}
                    className="ledger-table-row print-border-bottom"
                  >
                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{tx.date}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#fff' }} className="print-text-dark">{tx.description}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${tx.type === 'income' ? 'badge-teal' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {tx.type === 'income' ? 'Cash Inflow' : 'Operational Outflow'}
                    </td>
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      textAlign: 'right', 
                      fontWeight: 700,
                      color: tx.type === 'income' ? 'var(--accent-teal)' : '#fff'
                    }} className="print-text-dark">
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 820px) {
          .filters-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .ledger-table-row:hover {
          background: rgba(255,255,255,0.02);
        }

        /* PRINT STYLING ORCHESTRATION */
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
            font-family: 'Times New Roman', Times, serif;
          }
          .print-hide {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .print-card-outline {
            background: none !important;
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            color: #000 !important;
          }
          .print-border-bottom {
            border-bottom: 1px solid #333 !important;
          }
          .print-text-dark {
            color: #000 !important;
          }
          .report-summary-cards {
            grid-template-columns: 1fr 1fr 1fr !important;
            margin-bottom: 1.5rem !important;
          }
          .badge {
            border: 1px solid #333 !important;
            color: #000 !important;
            background: none !important;
            border-radius: 0 !important;
          }
          td, th {
            color: #000 !important;
            border-bottom: 1px solid #eee !important;
          }
        }
      `}} />
    </div>
  );
};
