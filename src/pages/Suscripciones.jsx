import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSuscripciones } from '../contexts/SuscripcionesContext';
import {
  createSuscripcion,
  updateSuscripcion,
  deleteSuscripcion,
  marcarComoPagado,
  toggleSuscripcion,
} from '../services/suscripciones';
import { formatCurrency } from '../utils/formatters';
import SuscripcionCard from '../components/SuscripcionCard';
import SuscripcionForm from '../components/SuscripcionForm';
import LoadingSpinner from '../components/LoadingSpinner';

const FILTROS = [
  { value: 'todas', label: 'Todas' },
  { value: 'activas', label: 'Activas' },
  { value: 'vencidas', label: 'Vencidas' },
  { value: 'proximas', label: 'Próximas (7 días)' },
  { value: 'pausadas', label: 'Pausadas' },
];

export default function Suscripciones() {
  const { user } = useAuth();
  const { suscripciones, loading, error, analisis } = useSuscripciones();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  const suscripcionesFiltradas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const en7dias = new Date(hoy);
    en7dias.setDate(en7dias.getDate() + 7);

    switch (filtro) {
      case 'activas':
        return suscripciones.filter((s) => s.activo !== false);
      case 'vencidas':
        return suscripciones.filter((s) => {
          if (s.activo === false) return false;
          const fp = s.proximoPago ? new Date(s.proximoPago + 'T00:00:00') : null;
          return fp && fp < hoy;
        });
      case 'proximas':
        return suscripciones.filter((s) => {
          if (s.activo === false) return false;
          const fp = s.proximoPago ? new Date(s.proximoPago + 'T00:00:00') : null;
          return fp && fp >= hoy && fp <= en7dias;
        });
      case 'pausadas':
        return suscripciones.filter((s) => s.activo === false);
      default:
        return suscripciones;
    }
  }, [suscripciones, filtro]);

  const handleCreate = async (data) => {
    await createSuscripcion(user.uid, data);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    await updateSuscripcion(editing.id, data);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (deleteId === id) {
      await deleteSuscripcion(id);
      setDeleteId(null);
    } else {
      setDeleteId(id);
      setTimeout(() => setDeleteId(null), 3000);
    }
  };

  const handleMarcarPagado = async (suscripcion) => {
    await marcarComoPagado(suscripcion.id, suscripcion);
  };

  const handleToggle = async (id, activo) => {
    await toggleSuscripcion(id, activo);
  };

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
        <p className="font-medium">No se pudieron cargar las suscripciones</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Suscripciones</h2>
          <p className="text-sm text-slate-500">Gestiona tus pagos recurrentes y servicios</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          {showForm ? 'Ocultar formulario' : '+ Nueva suscripción'}
        </button>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500">Gasto mensual estimado</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(analisis.totalMensual)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500">Gasto anual estimado</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(analisis.totalAnual)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500">Suscripciones activas</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{analisis.activas.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500">Alertas</p>
          <div className="flex items-center gap-2">
            {analisis.vencidas.length > 0 && (
              <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
                {analisis.vencidas.length} vencidas
              </span>
            )}
            {analisis.hoyMismo.length > 0 && (
              <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {analisis.hoyMismo.length} hoy
              </span>
            )}
            {analisis.proximas.length > 0 && (
              <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {analisis.proximas.length} próximas
              </span>
            )}
            {analisis.totalAlertas === 0 && (
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Todo al día</span>
            )}
          </div>
        </div>
      </div>

      {/* Formulario */}
      {(showForm || editing) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
            {editing ? 'Editar suscripción' : 'Nueva suscripción'}
          </h3>
          <SuscripcionForm
            suscripcion={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filtro === f.value
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
            {f.value === 'vencidas' && analisis.vencidas.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {analisis.vencidas.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de suscripciones */}
      {suscripcionesFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-600">
          <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="mt-4 text-slate-500">
            {filtro === 'todas' ? 'No tienes suscripciones' : 'No hay suscripciones con este filtro'}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Agrega tu primera suscripción para estar pendiente de los pagos
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {suscripcionesFiltradas.map((s) => (
            <SuscripcionCard
              key={s.id}
              suscripcion={s}
              onEdit={(suscripcion) => {
                setEditing(suscripcion);
                setShowForm(false);
              }}
              onDelete={handleDelete}
              onMarcarPagado={handleMarcarPagado}
              onToggle={handleToggle}
              deleteId={deleteId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
