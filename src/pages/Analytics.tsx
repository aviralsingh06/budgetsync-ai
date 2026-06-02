import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, TrendingUp, BarChart3 } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { transactions, savingsGoals } = useFinance();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, date: string, amount: number } | null>(null);

  // --- CHART 1: Category Distribution (Donut Chart) ---
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpenseVal = expenses.reduce((sum, t) => sum + t.amount, 0);

  const categoryData = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const colorPalette: Record<string, string> = {
    Housing: 'var(--accent-purple)',
    Food: 'var(--accent-teal)',
    Entertainment: 'var(--accent-cyan)',
    Transport: 'var(--accent-amber)',
    Health: 'var(--accent-rose)',
    Shopping: '#a855f7',
    Savings: '#ec4899',
    Other: '#71717a'
  };

  const donutSegments = Object.entries(categoryData).map(([name, amount]) => ({
    name,
    amount,
    percentage: totalExpenseVal > 0 ? (amount / totalExpenseVal) * 100 : 0,
    color: colorPalette[name] || '#6b7280'
  }));

  // Calculations for Donut Chart
  const donutRadius = 50;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedPercentage = 0;

  // --- CHART 2: Chronological Spending Trend (Line/Area Chart) ---
  // Group expenses by date and sort them
  const expensesByDate = expenses.reduce((acc, t) => {
    acc[t.date] = (acc[t.date] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.keys(expensesByDate).sort();
  const trendPoints = sortedDates.map(date => ({
    date,
    amount: expensesByDate[date]
  }));

  // Chart coordinates mapping (SVG width: 600, height: 200)
  const chartWidth = 600;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = trendPoints.length > 0 ? Math.max(...trendPoints.map(p => p.amount)) : 100;
  // Make maxVal have some buffer
  const yMax = maxVal * 1.15;

  const getCoordinates = () => {
    if (trendPoints.length === 0) return [];
    if (trendPoints.length === 1) {
      return [{
        x: paddingX + (chartWidth - 2 * paddingX) / 2,
        y: chartHeight - paddingY - ((trendPoints[0].amount / yMax) * (chartHeight - 2 * paddingY)),
        ...trendPoints[0]
      }];
    }

    return trendPoints.map((point, index) => {
      const x = paddingX + (index / (trendPoints.length - 1)) * (chartWidth - 2 * paddingX);
      const y = chartHeight - paddingY - ((point.amount / yMax) * (chartHeight - 2 * paddingY));
      return { x, y, ...point };
    });
  };

  const coordinates = getCoordinates();

  // Construct SVG Path
  const linePath = coordinates.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = coordinates.length > 0 
    ? `${linePath} L ${coordinates[coordinates.length - 1].x} ${chartHeight - paddingY} L ${coordinates[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="page-container animate-fade-in">
      
      {/* Page Title */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Telemetry Analytics</h1>
          <p className="section-subtitle">High-fidelity analysis of capital allocations & savings velocity.</p>
        </div>
      </div>

      {/* Overview stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Allocated Capital</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>${totalExpenseVal.toFixed(2)}</span>
        </div>
        <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spending Incursions</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{expenses.length} postings</span>
        </div>
        <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Posting Density</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>
            ${expenses.length > 0 ? (totalExpenseVal / expenses.length).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      {/* Grid: Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }} className="analytics-grid-top">
        
        {/* Trend Area Chart */}
        <div className="glass-card" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>Chronological Spending Trajectory</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily aggregation</span>
          </div>

          <div style={{ flex: 1, position: 'relative', width: '100%' }}>
            {trendPoints.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Insufficient transaction data to plot trend line.
              </div>
            ) : (
              <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                {/* Grids */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

                {/* Y Axis Labels */}
                <text x={paddingX - 10} y={paddingY + 4} fill="var(--text-muted)" fontSize="9" textAnchor="end">${yMax.toFixed(0)}</text>
                <text x={paddingX - 10} y={chartHeight / 2 + 4} fill="var(--text-muted)" fontSize="9" textAnchor="end">${(yMax/2).toFixed(0)}</text>
                <text x={paddingX - 10} y={chartHeight - paddingY + 4} fill="var(--text-muted)" fontSize="9" textAnchor="end">$0</text>

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area */}
                {areaPath && <path d={areaPath} fill="url(#chart-area-grad)" />}

                {/* Trend Line */}
                {linePath && <path d={linePath} fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                {/* Axis Dates */}
                {coordinates.map((coord, idx) => (
                  <g key={idx}>
                    {/* Tick line */}
                    <line x1={coord.x} y1={chartHeight - paddingY} x2={coord.x} y2={chartHeight - paddingY + 5} stroke="rgba(255,255,255,0.08)" />
                    {/* Date label */}
                    <text x={coord.x} y={chartHeight - paddingY + 16} fill="var(--text-muted)" fontSize="8.5" textAnchor="middle">
                      {coord.date.split('-').slice(1).join('/')}
                    </text>

                    {/* Interactive Circles */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="4"
                      fill="var(--bg-card)"
                      stroke="var(--accent-cyan)"
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPoint(coord)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
              </svg>
            )}

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div style={{
                position: 'absolute',
                top: `${(hoveredPoint.y / chartHeight) * 100 - 18}%`,
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                transform: 'translate(-50%, -100%)',
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '0.4rem 0.6rem',
                fontSize: '0.8rem',
                boxShadow: 'var(--shadow-md)',
                pointerEvents: 'none',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>${hoveredPoint.amount.toFixed(2)}</strong>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{hoveredPoint.date}</div>
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} style={{ color: 'var(--accent-purple)' }} />
            <span>Category Distribution</span>
          </h3>

          {donutSegments.length === 0 ? (
            <div style={{ display: 'flex', height: '160px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No expenses recorded yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem', alignItems: 'center' }} className="donut-grid-box">
              
              {/* Donut Render */}
              <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  {donutSegments.map((segment, idx) => {
                    const strokeDashoffset = donutCircumference - (segment.percentage / 100) * donutCircumference;
                    const rotation = (accumulatedPercentage / 100) * 360;
                    accumulatedPercentage += segment.percentage;

                    const isHovered = hoveredCategory === segment.name;

                    return (
                      <circle
                        key={idx}
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        fill="transparent"
                        stroke={segment.color}
                        strokeWidth={isHovered ? 13 : 9}
                        strokeDasharray={donutCircumference}
                        strokeDashoffset={strokeDashoffset}
                        transform={`rotate(${rotation} 60 60)`}
                        strokeLinecap="butt"
                        style={{
                          transition: 'all 0.25s ease',
                          cursor: 'pointer',
                          opacity: hoveredCategory && !isHovered ? 0.4 : 1
                        }}
                        onMouseEnter={() => setHoveredCategory(segment.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    );
                  })}
                </svg>

                {/* Center text */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}>
                  {hoveredCategory ? (
                    <>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>{hoveredCategory}</span>
                      <strong style={{ fontSize: '1.05rem', color: '#fff' }}>
                        {((categoryData[hoveredCategory] / totalExpenseVal) * 100).toFixed(0)}%
                      </strong>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Total</span>
                      <strong style={{ fontSize: '1.1rem', color: '#fff' }}>${totalExpenseVal.toFixed(0)}</strong>
                    </>
                  )}
                </div>
              </div>

              {/* Donut Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {donutSegments.map((segment, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      background: hoveredCategory === segment.name ? 'rgba(255,255,255,0.03)' : 'transparent',
                      transition: 'var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredCategory(segment.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: segment.color }} />
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ fontSize: '0.8rem', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{segment.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        ${segment.amount.toFixed(0)} ({segment.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Bottom Grid: Savings progression bars */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--accent-teal)' }} />
            <span>Savings Reserves Progression Ledger</span>
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target threshold vs capital in bank</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {savingsGoals.map(goal => {
            const pct = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.id} style={{ display: 'grid', gridTemplateColumns: '0.2fr 0.8fr', gap: '2rem', alignItems: 'center' }} className="savings-bar-row">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{goal.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{goal.category}</span>
                </div>
                
                {/* Horizontal Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    <span>Accumulated: <strong>${goal.current.toLocaleString()}</strong> of ${goal.target.toLocaleString()}</span>
                    <span>{pct}% Completed</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(to right, var(--accent-purple), var(--accent-teal))',
                      borderRadius: '4px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 890px) {
          .analytics-grid-top {
            grid-template-columns: 1fr !important;
          }
          .donut-grid-box {
            grid-template-columns: 1fr !important;
            justify-items: center;
          }
        }
        @media (max-width: 600px) {
          .savings-bar-row {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
        }
      `}} />
    </div>
  );
};
