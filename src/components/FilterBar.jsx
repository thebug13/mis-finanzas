import { MESES, TIPOS, INGRESO_CATEGORIAS, GASTO_CATEGORIAS } from '../constants/categories';

export default function FilterBar({ filters, updateFilter, resetFilters, showExport = false, onExportExcel, onExportCSV }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const categorias = filters.tipo === 'Ingreso'
    ? INGRESO_CATEGORIAS
    : filters.tipo === 'Gasto'
      ? GASTO_CATEGORIAS
      : [...INGRESO_CATEGORIAS, ...GASTO_CATEGORIAS];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[120px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Mes</label>
          <select
            value={filters.mes}
            onChange={(e) => updateFilter('mes', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Todos</option>
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[100px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Año</label>
          <select
            value={filters.anio}
            onChange={(e) => updateFilter('anio', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Todos</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[120px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Tipo</label>
          <select
            value={filters.tipo}
            onChange={(e) => {
              updateFilter('tipo', e.target.value);
              updateFilter('categoria', '');
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Todos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[140px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Categoría</label>
          <select
            value={filters.categoria}
            onChange={(e) => updateFilter('categoria', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Limpiar
        </button>

        {showExport && (
          <>
            <button
              onClick={onExportExcel}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Excel
            </button>
            <button
              onClick={onExportCSV}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              CSV
            </button>
          </>
        )}
      </div>
    </div>
  );
}
