import { useMemo } from 'react';
import { useMovimientos } from '../contexts/MovimientosContext';
import { useFilters } from '../hooks/useFilters';
import { filterMovimientos, calcularTotales, gastosPorCategoria, evolucionMensual } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  IngresosVsGastosChart,
  GastosPorCategoriaChart,
  EvolucionMensualChart,
} from '../components/Charts';

export default function Dashboard() {
  const { movimientos, loading, error } = useMovimientos();
  const { filters, updateFilter, resetFilters } = useFilters();

  const filtered = useMemo(
    () => filterMovimientos(movimientos, filters),
    [movimientos, filters]
  );

  const totales = useMemo(() => calcularTotales(filtered), [filtered]);
  const gastosCat = useMemo(() => gastosPorCategoria(filtered), [filtered]);
  const evolucion = useMemo(() => evolucionMensual(movimientos), [movimientos]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        <p className="font-medium">No se pudieron cargar los datos</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
        <p className="text-sm text-slate-500">Resumen de tus finanzas personales</p>
      </div>

      <FilterBar
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Ingresos"
          value={formatCurrency(totales.ingresos)}
          variant="income"
        />
        <StatCard
          title="Total Gastos"
          value={formatCurrency(totales.gastos)}
          variant="expense"
        />
        <StatCard
          title="Balance Actual"
          value={formatCurrency(totales.balance)}
          variant="balance"
        />
        <StatCard
          title="Movimientos"
          value={totales.cantidad}
          subtitle="registros filtrados"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
            Ingresos vs Gastos
          </h3>
          <IngresosVsGastosChart ingresos={totales.ingresos} gastos={totales.gastos} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
            Gastos por Categoría
          </h3>
          <GastosPorCategoriaChart data={gastosCat} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
          Evolución Mensual
        </h3>
        <EvolucionMensualChart data={evolucion} />
      </div>
    </div>
  );
}
