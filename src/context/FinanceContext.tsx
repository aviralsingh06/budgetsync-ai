import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface User {
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AdminSettings {
  budgetLimit: number;
  savingsGoalRatio: number;
  recommendationRule: string;
}

interface FinanceContextType {
  user: User | null;
  currentPage: string;
  isNavOpen: boolean;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  chatMessages: ChatMessage[];
  adminSettings: AdminSettings;
  login: (email: string, role: 'user' | 'admin') => boolean;
  logout: () => void;
  setPage: (page: string) => void;
  setNavOpen: (isOpen: boolean) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'current'>) => void;
  addSavingsContribution: (id: string, amount: number) => void;
  sendMessageToAI: (text: string) => Promise<void>;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  financialMetrics: {
    totalIncome: number;
    totalExpenses: number;
    remainingBalance: number;
    savingsRate: number;
    healthScore: number;
    recommendations: string[];
  };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-06-01', category: 'Salary', description: 'Monthly Corporate Salary', amount: 6500, type: 'income' },
  { id: '2', date: '2026-06-01', category: 'Housing', description: 'Metropolitan Apartment Rent', amount: 1800, type: 'expense' },
  { id: '3', date: '2026-06-02', category: 'Food', description: 'Organic Grocery Purchase - Whole Foods', amount: 245.50, type: 'expense' },
  { id: '4', date: '2026-05-28', category: 'Entertainment', description: 'Netflix Ultra HD Subscription', amount: 22.99, type: 'expense' },
  { id: '5', date: '2026-06-02', category: 'Transport', description: 'Chevron Station Refuel', amount: 65.00, type: 'expense' },
  { id: '6', date: '2026-06-01', category: 'Health', description: 'Equinox Gym Membership', amount: 120.00, type: 'expense' },
  { id: '7', date: '2026-05-30', category: 'Salary', description: 'Freelance Design Retainer', amount: 950, type: 'income' },
  { id: '8', date: '2026-06-02', category: 'Food', description: 'Starbucks Coffee & Pastry', amount: 14.50, type: 'expense' },
  { id: '9', date: '2026-05-29', category: 'Shopping', description: 'Apple Store - USB-C Charger', amount: 39.00, type: 'expense' },
];

const initialSavingsGoals: SavingsGoal[] = [
  { id: 'g1', name: 'Emergency Fund', target: 10000, current: 4500, category: 'Security' },
  { id: 'g2', name: 'Europe Summer Trip', target: 5000, current: 1800, category: 'Leisure' },
  { id: 'g3', name: 'Tesla Down Payment', target: 15000, current: 2500, category: 'Transport' },
];

const initialChatMessages: ChatMessage[] = [
  { id: 'm1', sender: 'ai', text: "Hello! I am your BudgetSync AI assistant. Ask me anything about your current budget, recent expenses, or tips to improve your financial wellness.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
];

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('budgetsync_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentPage, setCurrentPage] = useState<string>(() => user ? 'dashboard' : 'login');
  const [isNavOpen, setNavOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('budgetsync_txs');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('budgetsync_goals');
    return saved ? JSON.parse(saved) : initialSavingsGoals;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('budgetsync_admin');
    return saved ? JSON.parse(saved) : {
      budgetLimit: 3500,
      savingsGoalRatio: 20,
      recommendationRule: 'moderate'
    };
  });

  // Persist State
  useEffect(() => {
    if (user) {
      localStorage.setItem('budgetsync_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('budgetsync_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('budgetsync_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgetsync_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('budgetsync_admin', JSON.stringify(adminSettings));
  }, [adminSettings]);

  const login = (email: string, role: 'user' | 'admin'): boolean => {
    const username = email.split('@')[0];
    const uppercaseUsername = username.charAt(0).toUpperCase() + username.slice(1);
    const newUser: User = { username: uppercaseUsername, email, role };
    setUser(newUser);
    setCurrentPage(role === 'admin' ? 'admin' : 'dashboard');
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('login');
    setChatMessages(initialChatMessages);
  };

  const setPage = (page: string) => {
    setCurrentPage(page);
    setNavOpen(false);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'current'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 9),
      current: 0
    };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const addSavingsContribution = (id: string, amount: number) => {
    setSavingsGoals(prev => prev.map(g => {
      if (g.id === id) {
        // Also add a matching transaction record to reflect this contribution!
        addTransaction({
          date: new Date().toISOString().split('T')[0],
          category: 'Savings',
          description: `Contribution to ${g.name}`,
          amount: amount,
          type: 'expense'
        });
        return { ...g, current: Math.min(g.target, g.current + amount) };
      }
      return g;
    }));
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...settings }));
  };

  // Financial Metrics Calculations
  const calculateMetrics = () => {
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const remainingBalance = totalIncome - totalExpenses;

    const totalSavingsSaved = savingsGoals.reduce((sum, g) => sum + g.current, 0);
    const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0);
    
    // Savings Rate (percentage of total income remaining or in savings)
    const savingsRate = totalIncome > 0 
      ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))
      : 0;

    // Financial Health Score Algorithm
    // Scale 0 - 100
    let healthScore = 75; // Baseline
    
    if (totalIncome > 0) {
      const expenseRatio = totalExpenses / totalIncome;
      if (expenseRatio < 0.3) healthScore += 15;
      else if (expenseRatio < 0.5) healthScore += 8;
      else if (expenseRatio > 0.8) healthScore -= 20;
      else if (expenseRatio > 0.95) healthScore -= 35;
    } else {
      healthScore -= 30;
    }

    // Adjust score based on savings goals progress
    if (totalSavingsTarget > 0) {
      const savingsProgressRatio = totalSavingsSaved / totalSavingsTarget;
      healthScore += Math.round(savingsProgressRatio * 15);
    }

    // Limit exceeding check
    if (totalExpenses > adminSettings.budgetLimit) {
      healthScore -= 15;
    }

    healthScore = Math.min(100, Math.max(0, healthScore));

    // Smart recommendations engine based on data + admin settings
    const recommendations: string[] = [];
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) : 1;

    // Rule level adaptation
    const rule = adminSettings.recommendationRule;

    if (expenseRatio > 0.7) {
      recommendations.push(
        rule === 'strict' 
          ? "⚠️ CRITICAL: Expenses exceed 70% of income. Pause all non-essential dining and leisure categories immediately."
          : "⚠️ High Spending Alert: Expenses exceed 70% of income. We advise checking food & entertainment subscription totals."
      );
    } else if (expenseRatio < 0.4 && totalIncome > 0) {
      recommendations.push("✨ Excellent Budgeting: You are spending under 40% of your income. Consider allocating $300 to your Europe summer trip.");
    }

    if (totalExpenses > adminSettings.budgetLimit) {
      recommendations.push(`🚨 Budget Cap Exceeded: Spending ($${totalExpenses.toFixed(2)}) is over your threshold of $${adminSettings.budgetLimit}.`);
    } else if (adminSettings.budgetLimit - totalExpenses < 300) {
      recommendations.push(`⏳ Limit Approaching: You have only $${(adminSettings.budgetLimit - totalExpenses).toFixed(2)} left in your monthly cap.`);
    }

    // Category specific recommendations
    const foodExpenses = transactions
      .filter(tx => tx.type === 'expense' && tx.category.toLowerCase() === 'food')
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (foodExpenses > 400) {
      recommendations.push(`🍔 Food Spending: Grocery and takeout spending totals $${foodExpenses.toFixed(2)}. Preparing more meals at home could save you $80/month.`);
    }

    // Default savings tip
    if (savingsGoals.length > 0) {
      const slowGoals = savingsGoals.filter(g => g.current / g.target < 0.2);
      if (slowGoals.length > 0) {
        recommendations.push(`📈 Goal Boost: Your '${slowGoals[0].name}' goal is under 20%. Allocate freelance earnings directly to get it back on track.`);
      }
    }

    if (recommendations.length === 0) {
      recommendations.push("💡 Smart Tip: Set up automated transfers on paydays to build your Emergency Fund effortlessly.");
      recommendations.push("💡 Investing Tip: Now that your balance is positive, examine low-cost index funds for long-term growth.");
    }

    return {
      totalIncome,
      totalExpenses,
      remainingBalance,
      savingsRate,
      healthScore,
      recommendations
    };
  };

  const financialMetrics = calculateMetrics();

  // AI Assistant simulated chat responder
  const sendMessageToAI = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Dynamic smart responses referencing live state
    let reply = "";
    const lowerText = text.toLowerCase();
    const metrics = financialMetrics;

    if (lowerText.includes('analyze') || lowerText.includes('spending') || lowerText.includes('budget') || lowerText.includes('expense')) {
      const topExpenseCategories = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      const topCatText = Object.entries(topExpenseCategories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat, amt]) => `• ${cat}: $${amt.toFixed(2)}`)
        .join('\n');

      reply = `Based on your live profile, you have spent **$${metrics.totalExpenses.toFixed(2)}** out of **$${metrics.totalIncome.toFixed(2)}** in earnings (Expense Ratio: **${Math.round((metrics.totalExpenses / metrics.totalIncome) * 100)}%**).\n\nYour highest cost centers are:\n${topCatText || 'No recorded expenses'}\n\n*Recommendation*: Keep an eye on your **$${adminSettings.budgetLimit}** budget ceiling. You are currently ${metrics.totalExpenses > adminSettings.budgetLimit ? 'EXCEEDING' : 'within'} this threshold.`;
    } 
    else if (lowerText.includes('health') || lowerText.includes('score')) {
      reply = `Your Financial Health Score is currently **${metrics.healthScore}/100**. Here is the breakdown:\n\n1. **Adherence to Budget Limit (${metrics.totalExpenses > adminSettings.budgetLimit ? 'needs work' : 'excellent'})**: Spending is at $${metrics.totalExpenses.toFixed(2)} vs the $${adminSettings.budgetLimit} limit.\n2. **Savings Plan (Active)**: You have saved $${savingsGoals.reduce((sum, g) => sum + g.current, 0)} across ${savingsGoals.length} goals.\n3. **Debt-to-Savings Ratio**: High liquidity helps your safety margin.\n\n*Action*: To boost this score to 90+, try allocating $150 to your savings goals or reducing food takeaway spending.`;
    } 
    else if (lowerText.includes('save') || lowerText.includes('savings') || lowerText.includes('trip') || lowerText.includes('emergency')) {
      const goalsList = savingsGoals.map(g => `• **${g.name}**: $${g.current} of $${g.target} (${Math.round((g.current/g.target)*100)}%)`).join('\n');
      reply = `You have **${savingsGoals.length}** active savings targets:\n${goalsList}\n\nTo increase your savings: \n1. Contribute freelance earnings directly using the 'Savings Tracker' card.\n2. Set up direct transfers. If you increase your savings rate to **${metrics.savingsRate + 5}%**, you'll reach your 'Europe Summer Trip' goal 2 weeks earlier.`;
    } 
    else if (lowerText.includes('salary') || lowerText.includes('income') || lowerText.includes('freelance')) {
      const salaries = transactions.filter(t => t.type === 'income');
      reply = `I see **${salaries.length}** source(s) of income totaling **$${metrics.totalIncome.toFixed(2)}**. Your baseline Salary is $6,500.00 and freelance gigs brought in another $950.00.\n\nIncreasing monthly freelance contracts by $500 could allow you to fully fund your Emergency Fund in less than 3 months.`;
    }
    else {
      reply = `I have analyzed your BudgetSync AI ledger. \n\n• Current Monthly Balance: **$${metrics.remainingBalance.toFixed(2)}**\n• Health Index: **${metrics.healthScore}/100**\n• Expenses: **$${metrics.totalExpenses.toFixed(2)}**\n\nIs there a specific transaction category or savings target you want me to audit? You can ask things like *"Analyze my spending"* or *"How is my health score calculated?"*`;
    }

    const aiMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'ai',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, aiMessage]);
  };

  return (
    <FinanceContext.Provider value={{
      user,
      currentPage,
      isNavOpen,
      transactions,
      savingsGoals,
      chatMessages,
      adminSettings,
      login,
      logout,
      setPage,
      setNavOpen,
      addTransaction,
      deleteTransaction,
      addSavingsGoal,
      addSavingsContribution,
      sendMessageToAI,
      updateAdminSettings,
      financialMetrics
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
