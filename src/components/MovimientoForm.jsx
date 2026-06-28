import { useState, useEffect } from 'react';
import { getCategoriasPorTipo } from '../constants/categories';
import { toInputDate } from '../utils/formatters';

const emptyForm = {
  fecha: toInputDate(new Date()),
  tipo: 'Gasto',
  categoria: 'Mercado',
  concepto: '',
  valor: '',
  medio: 'Digital',
};

export default function MovimientoForm({ movimiento, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movimiento) {
      setForm({
        fecha: toInputDate(movimiento.fecha),
        tipo: movimiento.tipo,
        categoria: movimiento.categoria,
        concepto: movimiento.concepto,
        valor: movimiento.valor,
        medio: movimiento.medio || 'Digital',
      });
    } else {
      setForm(emptyForm);
    }
  }, [movimiento]);

  const categorias = getCategoriasPorTipo(form.tipo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipo') {
      const nuevasCategorias = getCategoriasPorTipo(value);
      setForm((prev) => ({
        ...prev,
        tipo: value,
        categoria: nuevasCategorias[0],
        medio: value === 'Transferencia' ? 'Digital→Físico' : 'Digital',
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.concepto || !form.valor) return;

    setLoading(true);
    try {
      await onSubmit(form);
      if (!movimiento) setForm(emptyForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tipo
          </label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="Ingreso">Ingreso</option>
            <option value="Gasto">Gasto</option>
            <option value="Transferencia">🔄 Transferencia (cambio de medio)</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Categoría
          </label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Valor
          </label>
          <input
            type="number"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            min="0"
            step="1"
            required
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {form.tipo === 'Transferencia' ? 'De (origen) → Hacia (destino)' : 'Medio'}
          </label>
          {form.tipo === 'Transferencia' ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, medio: 'Digital→Físico' }))}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
                    form.medio === 'Digital→Físico'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  💳→💵 Cajero / Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, medio: 'Físico→Digital' }))}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
                    form.medio === 'Físico→Digital'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  💵→💳 Consignar / Depósito
                </button>
              </div>
            </div>
          ) : (
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, medio: 'Digital' }))}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  form.medio === 'Digital'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                💳 Digital
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, medio: 'Físico' }))}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  form.medio === 'Físico'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                💵 Físico
              </button>
            </div>
          )}
          {form.tipo === 'Transferencia' && (
            <p className="mt-1 text-xs text-slate-500">El dinero no se pierde, solo cambia de lugar. No afecta tu saldo total.</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Concepto
        </label>
        <input
          type="text"
          name="concepto"
          value={form.concepto}
          onChange={handleChange}
          required
          placeholder="Descripción del movimiento"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : movimiento ? 'Actualizar' : 'Registrar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-6 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
