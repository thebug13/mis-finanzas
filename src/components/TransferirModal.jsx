import { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

export default function TransferirModal({ bolsillo, onTransferir, onClose }) {
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('agregar'); // agregar o quitar
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monto || Number(monto) <= 0) return;

    setLoading(true);
    try {
      const valor = tipo === 'agregar' ? Number(monto) : -Number(monto);
      await onTransferir(bolsillo.id, valor);
      setMonto('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Transferir a {bolsillo.nombre}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Saldo actual</p>
          <p className={`text-2xl font-bold ${bolsillo.saldo < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {formatCurrency(bolsillo.saldo)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Toggle tipo */}
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
            <button
              type="button"
              onClick={() => setTipo('agregar')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                tipo === 'agregar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              + Agregar
            </button>
            <button
              type="button"
              onClick={() => setTipo('quitar')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                tipo === 'quitar'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              - Quitar
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Monto a {tipo === 'agregar' ? 'agregar' : 'quitar'}
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              min="1"
              step="1"
              required
              autoFocus
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-medium dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {monto && Number(monto) > 0 && (
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Saldo resultante:</span>
                <span className={`font-medium ${
                  (tipo === 'agregar' ? bolsillo.saldo + Number(monto) : bolsillo.saldo - Number(monto)) < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {formatCurrency(
                    tipo === 'agregar'
                      ? bolsillo.saldo + Number(monto)
                      : bolsillo.saldo - Number(monto)
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !monto || Number(monto) <= 0}
              className={`flex-1 rounded-xl px-6 py-3 text-sm font-medium text-white transition disabled:opacity-50 ${
                tipo === 'agregar'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? 'Procesando...' : tipo === 'agregar' ? 'Agregar' : 'Quitar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
