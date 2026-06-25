export default function StatCard({ title, value, subtitle, variant = 'default' }) {
  const variants = {
    default: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
    income: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950',
    expense: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
    balance: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
  };

  const valueColors = {
    default: 'text-slate-900 dark:text-white',
    income: 'text-emerald-700 dark:text-emerald-300',
    expense: 'text-red-700 dark:text-red-300',
    balance: 'text-blue-700 dark:text-blue-300',
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${variants[variant]}`}>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${valueColors[variant]}`}>{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
