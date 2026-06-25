import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMovimientos } from '../contexts/MovimientosContext';
import { subscribePresupuesto, savePresupuesto } from '../services/presupuesto';
import { gastoRealPorCategoria } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { GASTO_CATEGORIAS, MESES } from '../constants/categories';
import { PresupuestoBarChart } from '../components/Charts';
import LoadingSpinner from '../components/LoadingSpinner';

function mergeCategorias(saved = {}) {
  return Object.fromEntries(
    GASTO_CATEGORIAS.map((cat) => [cat, Number(saved[cat]) || 0])
  );
}

export default function Presupuesto() {
  const { user } = useAuth();
  const { movimientos } = useMovimientos();
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [anio, setAnio] = useState(now.getFullYear());
  const [categorias, setCategorias] = useState(() => mergeCategorias());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');
  const dirtyRef = useRef(false);

  useEffect(() => {
    dirtyRef.current = false;
  }, [mes, anio]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setSaveMsg('');

    const unsubscribe = subscribePresupuesto(
      user.uid,
      mes,
      anio,
      (data) => {
        if (!dirtyRef.current) {
          setCategorias(mergeCategorias(data.categorias));
        }
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err?.code === 'permission-denied') {
          setError('Sin permiso. Vuelve a publicar las reglas con publicar-reglas.bat');
        } else {
          setError(err?.message || 'Error al cargar presupuesto');
        }
      }
    );

    return unsubscribe;
  }, [user, mes, anio]);

  const gastosReales = useMemo(
    () => gastoRealPorCategoria(movimientos, mes, anio),
    [movimientos, mes, anio]
  );

  const totalGastado = useMemo(
    () => Object.values(gastosReales).reduce((sum, v) => sum + v, 0),
    [gastosReales]
  );

  const totalMeta = useMemo(
    () => Object.values(categorias).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [categorias]
  );

  const handleMetaChange = (categoria, valor) => {
    dirtyRef.current = true;
    setSaveMsg('');
    setCategorias((prev) => ({
      ...prev,
      [categoria]: valor === '' ? 0 : Number(valor),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const toSave = Object.fromEntries(
        Object.entries(categorias).filter(([, v]) => Number(v) > 0)
      );
      await savePresupuesto(user.uid, mes, anio, toSave);
      dirtyRef.current = false;
      setSaveMsg('Presupuesto guardado correctamente');
    } catch (err) {
      console.error('Error al guardar presupuesto:', err);
      setSaveMsg(
        err?.code === 'permission-denied'
          ? 'Error: sin permiso para guardar. Republica las reglas de Firestore.'
          : `Error al guardar: ${err?.message || 'Intenta de nuevo'}`
      );
    } finally {
      setSaving(false);
    }
  };

  const getPorcentaje = (categoria) => {
    const meta = categorias[categoria] || 0;
    const real = gastosReales[categoria] || 0;
    if (meta === 0) return 0;
    return Math.min(Math.round((real / meta) * 100), 999);
  };

  const getBarColor = (porcentaje) => {
    if (porcentaje <= 70) return 'bg-emerald-500';
    if (porcentaje <= 90) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const mesLabel = MESES.find((m) => m.value === mes)?.label || mes;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

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
        <p className="font-medium">No se pudo cargar el presupuesto</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Presupuesto Mensual</h2>
        <p className="text-sm text-slate-500">
          Define metas de gasto por categoría y controla tu consumo
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500">Gastado en {mesLabel} {anio}</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalGastado)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500">Meta total definida</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalMeta)}</p>
        </div>
      </div>

      {totalGastado === 0 && movimientos.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          No hay gastos en {mesLabel} {anio}. Cambia el mes o año arriba para ver tus movimientos.
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Mes</label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Año</label>
          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar presupuesto'}
        </button>
      </div>

      {saveMsg && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            saveMsg.includes('Error')
              ? 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
          }`}
        >
          {saveMsg}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
          Comparativa presupuesto vs gasto real
        </h3>
        <PresupuestoBarChart categorias={categorias} gastosReales={gastosReales} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GASTO_CATEGORIAS.map((categoria) => {
          const meta = categorias[categoria] || 0;
          const real = gastosReales[categoria] || 0;
          const porcentaje = getPorcentaje(categoria);

          return (
            <div
              key={categoria}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">{categoria}</h4>
                <span
                  className={`text-xs font-bold ${
                    meta === 0
                      ? 'text-slate-400'
                      : porcentaje > 90
                        ? 'text-red-600'
                        : porcentaje > 70
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                  }`}
                >
                  {meta > 0 ? `${porcentaje}%` : real > 0 ? 'Sin meta' : '—'}
                </span>
              </div>

              <div className="mb-3">
                <label className="mb-1 block text-xs text-slate-500">Meta mensual</label>
                <input
                  type="number"
                  value={meta > 0 ? meta : ''}
                  onChange={(e) => handleMetaChange(categoria, e.target.value)}
                  placeholder="Ej: 500000"
                  min="0"
                  step="1000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="mb-2 flex justify-between text-xs text-slate-500">
                <span>Gastado: {formatCurrency(real)}</span>
                <span>Meta: {formatCurrency(meta)}</span>
              </div>

              {meta > 0 && (
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all ${getBarColor(porcentaje)}`}
                    style={{ width: `${Math.min(porcentaje, 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
