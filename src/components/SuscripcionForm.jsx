import { useState, useEffect } from 'react';
import { FRECUENCIAS, CATEGORIAS_SUSCRIPCION } from '../services/suscripciones';
import { toInputDate } from '../utils/formatters';

const emptyForm = {
  nombre: '',
  monto: '',
  frecuencia: 'mensual',
  categoria: 'Streaming',
  proximoPago: toInputDate(new Date()),
  diaPago: '',
  proveedor: '',
  notas: '',
};

export default function SuscripcionForm({ suscripcion, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (suscripcion) {
      setForm({
        nombre: suscripcion.nombre || '',
        monto: suscripcion.monto?.toString() || '',
        frecuencia: suscripcion.frecuencia || 'mensual',
        categoria: suscripcion.categoria || 'Streaming',
        proximoPago: suscripcion.proximoPago
          ? toInputDate(suscripcion.proximoPago)
          : toInputDate(new Date()),
        diaPago: suscripcion.diaPago?.toString() || '',
        proveedor: suscripcion.proveedor || '',
        notas: suscripcion.notas || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [suscripcion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.monto || !form.proximoPago) return;

    setLoading(true);
    try {
      await onSubmit(form);
      if (!suscripcion) setForm(emptyForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nombre del servicio *
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Netflix, Spotify, Internet"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Monto *
          </label>
          <input
            type="number"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            min="0"
            step="1"
            required
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Frecuencia de pago
          </label>
          <select
            name="frecuencia"
            value={form.frecuencia}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            {FRECUENCIAS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
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
            {CATEGORIAS_SUSCRIPCION.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Próximo pago *
          </label>
          <input
            type="date"
            name="proximoPago"
            value={form.proximoPago}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Día de pago (opcional)
          </label>
          <input
            type="number"
            name="diaPago"
            value={form.diaPago}
            onChange={handleChange}
            min="1"
            max="31"
            placeholder="Ej: 15"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Proveedor / Empresa
        </label>
        <input
          type="text"
          name="proveedor"
          value={form.proveedor}
          onChange={handleChange}
          placeholder="Ej: Claro, Tigo, Movistar"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Notas
        </label>
        <textarea
          name="notas"
          value={form.notas}
          onChange={handleChange}
          rows={2}
          placeholder="Notas adicionales sobre esta suscripción"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : suscripcion ? 'Actualizar' : 'Crear suscripción'}
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
