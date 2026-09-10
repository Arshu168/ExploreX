import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Fuel, 
  Utensils, 
  Hotel, 
  Compass, 
  ShieldAlert, 
  Download,
  Trash2,
  X,
  Info,
  ShieldCheck
} from 'lucide-react';
import { Expense, Trip } from '../types';
import { getBudgetBoundsForDestination } from '../utils/budgetUtils';
import { formatCurrency, getCurrencyConfig } from '../utils/currencyUtils';

interface BudgetPlannerViewProps {
  activeTrip: Trip;
  expenses: Expense[];
  onAddExpense: (newExp: Expense) => void;
  onDeleteExpense?: (expenseId: string) => void;
  onUpdateTripBudget?: (newBudget: number) => void;
  preferredCurrency?: string;
}

export const BudgetPlannerView: React.FC<BudgetPlannerViewProps> = ({
  activeTrip,
  expenses,
  onAddExpense,
  onDeleteExpense,
  onUpdateTripBudget,
  preferredCurrency = 'INR',
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [customBudgetVal, setCustomBudgetVal] = useState<string>('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'fuel' | 'food' | 'stay' | 'activity' | 'emergency' | 'other'>('fuel');
  const [paidBy, setPaidBy] = useState('Harish');
  const [notes, setNotes] = useState('');

  const totalBudget = activeTrip ? (activeTrip.budgetTotal || 0) : 0;
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const spentPercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const fuelSpent = expenses.filter(e => e.category === 'fuel').reduce((acc, c) => acc + c.amount, 0);
  const foodSpent = expenses.filter(e => e.category === 'food').reduce((acc, c) => acc + c.amount, 0);
  const staySpent = expenses.filter(e => e.category === 'stay').reduce((acc, c) => acc + c.amount, 0);
  const actSpent = expenses.filter(e => e.category === 'activity').reduce((acc, c) => acc + c.amount, 0);
  const emergencySpent = expenses.filter(e => e.category === 'emergency').reduce((acc, c) => acc + c.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      tripId: activeTrip?.id || 't1',
      category,
      title,
      amount: Number(amount),
      paidBy,
      date: new Date().toISOString().split('T')[0],
      notes
    };

    onAddExpense(newExpense);
    setTitle('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Amount (INR)', 'Paid By', 'Date', 'Notes'];
    const rows = expenses.map(e => [
      e.id,
      `"${e.title.replace(/"/g, '""')}"`,
      e.category,
      e.amount,
      `"${e.paidBy}"`,
      e.date,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Budget_Expenses_${activeTrip?.title || 'Trip'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Budget Planner & Expenses</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 font-medium">
            Track real-time trip expenses, monitor category limits, and update budgets according to your preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-2xs space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Budget Allocated</span>
            {onUpdateTripBudget && (
              <button
                onClick={() => {
                  if (isEditingBudget) {
                    const num = Number(customBudgetVal);
                    if (!isNaN(num) && num >= 0) {
                      onUpdateTripBudget(num);
                    }
                    setIsEditingBudget(false);
                  } else {
                    setCustomBudgetVal(totalBudget.toString());
                    setIsEditingBudget(true);
                  }
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 transition cursor-pointer"
              >
                {isEditingBudget ? 'Save' : totalBudget === 0 ? 'Set Budget' : 'Change Limit'}
              </button>
            )}
          </div>

          {isEditingBudget ? (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xl font-black text-slate-900 dark:text-white">{getCurrencyConfig(preferredCurrency).symbol}</span>
              <input
                type="number"
                min={0}
                value={customBudgetVal}
                onChange={(e) => setCustomBudgetVal(e.target.value)}
                className="w-full text-xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                placeholder="Enter custom budget..."
                autoFocus
              />
            </div>
          ) : (
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(totalBudget, preferredCurrency)}
            </p>
          )}

          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            {totalBudget === 0
              ? 'Starts from 0 before trip planning. Set your budget anytime.'
              : `${activeTrip?.durationDays || 3} Days • ${activeTrip?.groupSize || 2} Travelers (Custom User Preference)`}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Actual Spent</span>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(totalSpent, preferredCurrency)}</p>
          <p className="text-[11px] text-blue-700 dark:text-blue-400 font-bold">{spentPercent}% of Total Cap Used</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Remaining Cushion</span>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(remaining, preferredCurrency)}</p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Safe Buffer Remaining</p>
        </div>
      </div>

      {/* Budget Meter Bar & Destination Safeguard */}
      {(() => {
        const destName = activeTrip?.region || activeTrip?.title || 'Coimbatore & Valparai';
        const duration = activeTrip?.durationDays || 3;
        const group = activeTrip?.groupSize || 2;
        const bounds = getBudgetBoundsForDestination(destName, duration, group);

        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Trip Budget Meter</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">{spentPercent}% Used</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-3xl p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Destination Limit Guide</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-600 dark:bg-blue-500 text-white font-extrabold text-[10px]">
                  {bounds.tier}
                </span>
              </div>
              <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium">
                Benchmark limit for <strong className="font-bold text-blue-950 dark:text-blue-100">{bounds.destination}</strong> ({duration} Days, {group} Travelers):
              </p>
              <div className="flex justify-between font-extrabold text-slate-900 dark:text-slate-100 pt-1 border-t border-blue-200/60 dark:border-blue-900/60 text-[11px]">
                <span>Min: {formatCurrency(bounds.minBudget, preferredCurrency)}</span>
                <span className="text-blue-700 dark:text-blue-400">Rec: {formatCurrency(bounds.suggestedBudget, preferredCurrency)}</span>
                <span>Max: {formatCurrency(bounds.maxSuggestedBudget, preferredCurrency)}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Categorical Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <Fuel className="w-4 h-4" /> Transport
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(fuelSpent, preferredCurrency)}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <Utensils className="w-4 h-4" /> Dining
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(foodSpent, preferredCurrency)}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold text-xs">
            <Hotel className="w-4 h-4" /> Hotel / Stay
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(staySpent, preferredCurrency)}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <Compass className="w-4 h-4" /> Activities
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(actSpent, preferredCurrency)}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" /> Emergency
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(emergencySpent, preferredCurrency)}</p>
        </div>
      </div>

      {/* Expense Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
        <h2 className="font-extrabold text-slate-900 dark:text-white text-base">Logged Expenses</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 uppercase text-[10px] text-slate-500 dark:text-slate-400 font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Paid By</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 dark:text-slate-500">
                    No expenses logged yet. Click "Add Expense" to track your first cost.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{exp.title}</td>
                    <td className="p-3.5 capitalize font-semibold text-blue-600 dark:text-blue-400">{exp.category}</td>
                    <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">{formatCurrency(exp.amount, preferredCurrency)}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{exp.paidBy}</td>
                    <td className="p-3.5 text-slate-400 dark:text-slate-500">{exp.date}</td>
                    <td className="p-3.5 text-right">
                      {onDeleteExpense && (
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition opacity-80 group-hover:opacity-100"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Log Trip Expense</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Private Gozzo Boat Tour"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Amount ({getCurrencyConfig(preferredCurrency).symbol})</label>
                  <input
                    type="number"
                    required
                    placeholder="12000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="fuel">Transport</option>
                    <option value="food">Food & Dining</option>
                    <option value="stay">Hotel / Stay</option>
                    <option value="activity">Activities</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
