import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMovimientos } from '../contexts/MovimientosContext';
import { useBolsillos } from '../contexts/BolsillosContext';
import { useSuscripciones } from '../contexts/SuscripcionesContext';
import { useFilters } from '../hooks/useFilters';
import { filterMovimientos, calcularTotales, gastosPorCategoria, evolucionMensual } from '../utils/calculations';
import { formatCurrency, formatFecha } from '../utils/formatters';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  IngresosVsGastosChart,
  GastosPorCategoriaChart,
  EvolucionMensualChart,
} from '../components/Charts';

function getSaludoCorto() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Buenos días';
  if (h >= 12 && h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Dashboard() {
  const { user } = useAuth();
  const { movimientos, loading, error } = useMovimientos();
  const { bolsillos } = useBolsillos();
  const { analisis } = useSuscripciones();
  const { filters, updateFilter, resetFilters } = useFilters();

  const filtered = useMemo(
    () => filterMovimientos(movimientos, filters),
    [movimientos, filters]
  );

  const totales = useMemo(() => calcularTotales(filtered), [filtered]);
  const gastosCat = useMemo(() => gastosPorCategoria(filtered), [filtered]);
  const evolucion = useMemo(() => evolucionMensual(movimientos), [movimientos]);

  const totalBolsillos = bolsillos.reduce((sum, b) => sum + (b.saldo || 0), 0);
  const totalDigital = bolsillos.filter(b => (b.tipo || 'Digital') === 'Digital').reduce((sum, b) => sum + (b.saldo || 0), 0);
  const totalFisico = bolsillos.filter(b => b.tipo === 'Físico').reduce((sum, b) => sum + (b.saldo || 0), 0);
  const alertas = [...analisis.vencidas, ...analisis.hoyMismo, ...analisis.proximas];

  const nombre = user?.displayName?.split(' ')[0] || '';
  const porcentajeGasto = totales.ingresos > 0 ? Math.round((totales.gastos / totales.ingresos) * 100) : 0;

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
      {/* Saludo */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {getSaludoCorto()}{nombre ? `, ${nombre}` : ''}! 👋
          </h2>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })} &bull; Aquí está tu resumen financiero
          </p>
        </div>
        {totales.ingresos > 0 && (
          <div className={`rounded-2xl px-4 py-2 text-sm font-medium ${
            porcentajeGasto > 90 ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
            porcentajeGasto > 70 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          }`}>
            {porcentajeGasto > 90 ? '🚨' : porcentajeGasto > 70 ? '⚠️' : '✅'} Gastas el {porcentajeGasto}% de tus ingresos
          </div>
        )}
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
          subtitle={`${filtered.filter(m => m.tipo === 'Ingreso').length} entradas`}
        />
        <StatCard
          title="Total Gastos"
          value={formatCurrency(totales.gastos)}
          variant="expense"
          subtitle={`${filtered.filter(m => m.tipo === 'Gasto').length} gastos registrados`}
        />
        <StatCard
          title="Balance disponible"
          value={formatCurrency(totales.balance)}
          variant="balance"
          trend={totales.ingresos > 0 ? 100 - porcentajeGasto : undefined}
          trendLabel="libre"
        />
        <StatCard
          title="Transferencias"
          value={formatCurrency(totales.transferencias || 0)}
          variant="transfer"
          subtitle={`${filtered.filter(m => m.tipo === 'Transferencia').length} cambios de medio`}
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

      {/* Bolsillos y Suscripciones */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Resumen Bolsillos */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">Bolsillos</h3>
            <Link to="/bolsillos" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              Ver todos
            </Link>
          </div>
          {bolsillos.length === 0 ? (
            <p className="text-sm text-slate-500">No tienes bolsillos creados</p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className={`text-sm font-bold ${totalBolsillos < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatCurrency(totalBolsillos)}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950">
                  <p className="text-xs text-blue-600 dark:text-blue-400">💳 Digital</p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{formatCurrency(totalDigital)}</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950">
                  <p className="text-xs text-amber-600 dark:text-amber-400">💵 Efectivo</p>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{formatCurrency(totalFisico)}</p>
                </div>
              </div>
              <div className="space-y-2">
                {bolsillos.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: b.color || '#10b981' }} />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{b.nombre}</span>
                      <span className="text-[10px] text-slate-400">{b.tipo === 'Físico' ? '💵' : '💳'}</span>
                    </div>
                    <span className={`text-sm font-medium ${b.saldo < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                      {formatCurrency(b.saldo)}
                    </span>
                  </div>
                ))}
                {bolsillos.length > 4 && (
                  <p className="text-xs text-slate-500">+{bolsillos.length - 4} más</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Próximas suscripciones */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">Próximos pagos</h3>
            <Link to="/suscripciones" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              Ver todas
            </Link>
          </div>
          {alertas.length === 0 ? (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-sm text-slate-500">Todo al día</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alertas.slice(0, 5).map((s) => {
                const esVencida = s._estado === 'vencida';
                const esHoy = s._estado === 'hoy';
                return (
                  <div key={s.id} className={`flex items-center justify-between rounded-xl p-3 ${
                    esVencida ? 'bg-red-50 dark:bg-red-950' : esHoy ? 'bg-amber-50 dark:bg-amber-950' : 'bg-slate-50 dark:bg-slate-700'
                  }`}>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{s.nombre}</p>
                      <p className="text-xs text-slate-500">{formatFecha(s.proximoPago)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(s.monto)}</p>
                      <span className={`text-[10px] font-medium ${
                        esVencida ? 'text-red-600 dark:text-red-400' : esHoy ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {esVencida ? 'Vencida' : esHoy ? 'Hoy' : 'Próxima'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
