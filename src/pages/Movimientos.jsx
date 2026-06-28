import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMovimientos } from '../contexts/MovimientosContext';
import { useFilters } from '../hooks/useFilters';
import {
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
} from '../services/movimientos';
import { filterMovimientos } from '../utils/calculations';
import { formatCurrency, formatFecha } from '../utils/formatters';
import { exportToExcel, exportToCSV } from '../utils/export';
import MovimientoForm from '../components/MovimientoForm';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Movimientos() {
  const { user } = useAuth();
  const { movimientos, loading, error } = useMovimientos();
  const { filters, updateFilter, resetFilters } = useFilters();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(
    () => filterMovimientos(movimientos, filters),
    [movimientos, filters]
  );

  const handleCreate = async (data) => {
    await createMovimiento(user.uid, data);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    await updateMovimiento(editing.id, data);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (deleteId === id) {
      await deleteMovimiento(id);
      setDeleteId(null);
    } else {
      setDeleteId(id);
      setTimeout(() => setDeleteId(null), 3000);
    }
  };

  const handleExportExcel = () => {
    exportToExcel(filtered, `movimientos_${filters.anio || 'todos'}`);
  };

  const handleExportCSV = () => {
    exportToCSV(filtered, `movimientos_${filters.anio || 'todos'}`);
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
        <p className="font-medium">No se pudieron cargar los movimientos</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Movimientos</h2>
          <p className="text-sm text-slate-500">Registra y gestiona tus transacciones</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          {showForm ? 'Ocultar formulario' : '+ Nuevo movimiento'}
        </button>
      </div>

      {(showForm || editing) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
            {editing ? 'Editar movimiento' : 'Nuevo movimiento'}
          </h3>
          <MovimientoForm
            movimiento={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <FilterBar
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        showExport
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportCSV}
      />

      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 dark:border-slate-700 dark:bg-slate-800">
            No hay movimientos con los filtros seleccionados
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        m.tipo === 'Ingreso'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {m.tipo}
                    </span>
                    <span className="text-xs text-slate-500">{m.categoria}</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      m.medio === 'Físico'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {m.medio === 'Físico' ? '💵' : '💳'} {m.medio || 'Digital'}
                    </span>
                  </div>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">{m.concepto}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{formatFecha(m.fecha)}</p>
                </div>
                <p
                  className={`text-lg font-bold ${
                    m.tipo === 'Ingreso'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {m.tipo === 'Ingreso' ? '+' : '-'}{formatCurrency(m.valor)}
                </p>
              </div>
              <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                <button
                  onClick={() => {
                    setEditing(m);
                    setShowForm(false);
                  }}
                  className="flex-1 rounded-lg bg-blue-50 py-1.5 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium ${
                    deleteId === m.id
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                  }`}
                >
                  {deleteId === m.id ? 'Confirmar' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block dark:border-slate-700 dark:bg-slate-800">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No hay movimientos con los filtros seleccionados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Categoría</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Concepto</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Medio</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Valor</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-750"
                  >
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {formatFecha(m.fecha)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          m.tipo === 'Ingreso'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {m.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{m.categoria}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{m.concepto}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        m.medio === 'Físico'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {m.medio === 'Físico' ? '💵' : '💳'} {m.medio || 'Digital'}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        m.tipo === 'Ingreso'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {m.tipo === 'Ingreso' ? '+' : '-'}{formatCurrency(m.valor)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditing(m);
                            setShowForm(false);
                          }}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className={`rounded-lg px-2 py-1 text-xs font-medium ${
                            deleteId === m.id
                              ? 'bg-red-600 text-white'
                              : 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950'
                          }`}
                        >
                          {deleteId === m.id ? 'Confirmar' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
