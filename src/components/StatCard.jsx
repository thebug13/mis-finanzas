export default function StatCard({ title, value, subtitle, variant = 'default', icon, trend, trendLabel }) {
  const variants = {
    default: {
      card: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
      value: 'text-slate-900 dark:text-white',
      icon: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
    },
    income: {
      card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-800 dark:from-emerald-950 dark:to-slate-800',
      value: 'text-emerald-700 dark:text-emerald-300',
      icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400',
    },
    expense: {
      card: 'border-red-200 bg-gradient-to-br from-red-50 to-white dark:border-red-800 dark:from-red-950 dark:to-slate-800',
      value: 'text-red-700 dark:text-red-300',
      icon: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
    },
    balance: {
      card: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:border-blue-800 dark:from-blue-950 dark:to-slate-800',
      value: 'text-blue-700 dark:text-blue-300',
      icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    },
    transfer: {
      card: 'border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:border-purple-800 dark:from-purple-950 dark:to-slate-800',
      value: 'text-purple-700 dark:text-purple-300',
      icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    },
  };

  const style = variants[variant] || variants.default;

  const defaultIcons = {
    income: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    ),
    expense: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    ),
    balance: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    default: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    transfer: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  };

  const iconEl = icon || defaultIcons[variant] || defaultIcons.default;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${style.card}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.icon}`}>
          {iconEl}
        </div>
      </div>
      <p className={`mt-3 text-2xl font-bold ${style.value}`}>{value}</p>
      {(subtitle || trend !== undefined) && (
        <div className="mt-2 flex items-center gap-2">
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
          {trend !== undefined && (
            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
              trend > 0
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : trend < 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
            }`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
              {trendLabel && <span className="ml-1 opacity-70">{trendLabel}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
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
