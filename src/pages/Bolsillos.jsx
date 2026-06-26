import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBolsillos } from '../contexts/BolsillosContext';
import {
  createBolsillo,
  updateBolsillo,
  deleteBolsillo,
  actualizarSaldoBolsillo,
} from '../services/bolsillos';
import { formatCurrency } from '../utils/formatters';
import BolsilloCard from '../components/BolsilloCard';
import BolsilloForm from '../components/BolsilloForm';
import TransferirModal from '../components/TransferirModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Bolsillos() {
  const { user } = useAuth();
  const { bolsillos, loading, error } = useBolsillos();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [transferirBolsillo, setTransferirBolsillo] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const totalEnBolsillos = bolsillos.reduce((sum, b) => sum + (b.saldo || 0), 0);

  const handleCreate = async (data) => {
    await createBolsillo(user.uid, data);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    await updateBolsillo(editing.id, data);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (deleteId === id) {
      await deleteBolsillo(id);
      setDeleteId(null);
    } else {
      setDeleteId(id);
      setTimeout(() => setDeleteId(null), 3000);
    }
  };

  const handleTransferir = async (bolsilloId, monto) => {
    await actualizarSaldoBolsillo(bolsilloId, monto);
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
        <p className="font-medium">No se pudieron cargar los bolsillos</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bolsillos</h2>
          <p className="text-sm text-slate-500">Organiza tu dinero en bolsillos separados</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          {showForm ? 'Ocultar formulario' : '+ Nuevo bolsillo'}
        </button>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500">Total en bolsillos</p>
          <p className={`text-2xl font-bold ${totalEnBolsillos < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {formatCurrency(totalEnBolsillos)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500">Cantidad de bolsillos</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{bolsillos.length}</p>
        </div>
        {bolsillos.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Bolsillo más grande</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {bolsillos.reduce((max, b) => (b.saldo > max.saldo ? b : max), bolsillos[0]).nombre}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {formatCurrency(bolsillos.reduce((max, b) => (b.saldo > max.saldo ? b : max), bolsillos[0]).saldo)}
            </p>
          </div>
        )}
      </div>

      {/* Formulario crear/editar */}
      {(showForm || editing) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
            {editing ? 'Editar bolsillo' : 'Nuevo bolsillo'}
          </h3>
          <BolsilloForm
            bolsillo={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* Grid de bolsillos */}
      {bolsillos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-600">
          <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
          </svg>
          <p className="mt-4 text-slate-500">No tienes bolsillos creados</p>
          <p className="mt-1 text-sm text-slate-400">Crea tu primer bolsillo para empezar a organizar tu dinero</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bolsillos.map((b) => (
            <BolsilloCard
              key={b.id}
              bolsillo={b}
              onEdit={(bolsillo) => {
                setEditing(bolsillo);
                setShowForm(false);
              }}
              onDelete={handleDelete}
              onTransferir={setTransferirBolsillo}
              deleteId={deleteId}
            />
          ))}
        </div>
      )}

      {/* Modal de transferencia */}
      {transferirBolsillo && (
        <TransferirModal
          bolsillo={transferirBolsillo}
          onTransferir={handleTransferir}
          onClose={() => setTransferirBolsillo(null)}
        />
      )}
    </div>
  );
}
