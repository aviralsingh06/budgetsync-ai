import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Send, Sparkles, BrainCircuit, CornerDownLeft, HelpCircle } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const { chatMessages, sendMessageToAI } = useFinance();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const presets = [
    { label: "Analyze spending ratios", query: "Analyze my monthly expenses and budget splits" },
    { label: "Check health score details", query: "How is my financial health score computed?" },
    { label: "Savings acceleration tip", query: "How can I optimize my savings goals?" },
    { label: "Recent income audit", query: "Audit my recent income postings" }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;
    setInput('');
    setSending(true);

    try {
      await sendMessageToAI(textToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, sending]);

  return (
    <div className="page-container animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 100px)',
      maxHeight: '800px',
    }}>
      
      {/* Page Header */}
      <div className="section-header" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="section-title">Cognitive Advisor Core</h1>
          <p className="section-subtitle">Real-time ledger auditor and financial health optimization advisor.</p>
        </div>
      </div>

      {/* Main Chat Box */}
      <div 
        className="glass-panel" 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--border-radius-lg)',
          background: 'rgba(18, 18, 22, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        
        {/* Top Info Ribbon */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '0.4rem',
              borderRadius: '8px',
              color: 'var(--accent-cyan)'
            }}>
              <BrainCircuit size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#fff' }}>BudgetSync Neural Agent</strong>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent-teal)' }}>Online • Connected to live ledger</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Sparkles size={12} className="text-gradient-teal-cyan" />
            <span>LLM: Gemini-Powered</span>
          </div>
        </div>

        {/* Message Log */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {chatMessages.map(msg => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isAI ? 'flex-start' : 'flex-end',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                {isAI && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
                  }}>
                    <BrainCircuit size={16} color="#000" />
                  </div>
                )}

                <div style={{
                  maxWidth: '75%',
                  background: isAI ? 'rgba(255, 255, 255, 0.03)' : 'rgba(6, 182, 212, 0.08)',
                  border: isAI ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(6, 182, 212, 0.15)',
                  borderRadius: isAI ? '0px 14px 14px 14px' : '14px 0px 14px 14px',
                  padding: '0.85rem 1.2rem',
                  color: isAI ? 'var(--text-primary)' : '#fff',
                  fontSize: '0.92rem',
                  lineHeight: '1.5',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                  <span style={{
                    display: 'block',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    textAlign: isAI ? 'left' : 'right',
                    marginTop: '0.5rem'
                  }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {sending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BrainCircuit size={16} color="#000" />
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '0px 14px 14px 14px',
                padding: '0.85rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--accent-cyan)', borderRadius: '50%', animation: 'pulseGlow 1s infinite alternate' }} />
                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--accent-teal)', borderRadius: '50%', animation: 'pulseGlow 1s infinite alternate', animationDelay: '0.2s' }} />
                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--accent-purple)', borderRadius: '50%', animation: 'pulseGlow 1s infinite alternate', animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Buttons */}
        <div style={{
          padding: '0.75rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(0,0,0,0.15)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', width: '100%', marginBottom: '0.25rem' }}>
            <HelpCircle size={12} /> Suggested Audits:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              disabled={sending}
              style={{
                fontSize: '0.78rem',
                padding: '0.4rem 0.8rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              className="preset-badge"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Textbox form */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(18, 18, 22, 0.9)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Query BudgetSync AI (e.g. Analyze my cost distribution)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.85rem 1rem',
                paddingRight: '3rem',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'var(--transition-fast)'
              }}
              className="chatbot-input"
            />
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              border: '1px solid rgba(255,255,255,0.04)',
              background: 'rgba(255,255,255,0.01)',
              padding: '2px 6px',
              borderRadius: '4px'
            }} className="mobile-hide">
              <span>Enter</span>
              <CornerDownLeft size={10} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-icon-only"
            disabled={!input.trim() || sending}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--border-radius-sm)',
              boxShadow: input.trim() ? '0 0 15px rgba(6, 182, 212, 0.3)' : 'none',
              opacity: input.trim() ? 1 : 0.4,
              cursor: input.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            <Send size={18} />
          </button>
        </form>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .preset-badge:hover {
          background: rgba(255,255,255,0.08) !important;
          color: #fff !important;
          border-color: rgba(255,255,255,0.15) !important;
        }
        .chatbot-input:focus {
          border-color: var(--accent-cyan) !important;
          box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2) !important;
          background: rgba(0, 0, 0, 0.6) !important;
        }
        .dot {
          display: inline-block;
        }
      `}} />
    </div>
  );
};
