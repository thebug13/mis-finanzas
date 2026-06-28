import { useState, useEffect } from 'react';

const COLORES = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b',
  '#ef4444', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6', '#e11d48',
];

const emptyForm = {
  nombre: '',
  descripcion: '',
  saldo: '',
  imagenUrl: '',
  color: '#10b981',
  tipo: 'Digital',
};

export default function BolsilloForm({ bolsillo, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (bolsillo) {
      setForm({
        nombre: bolsillo.nombre || '',
        descripcion: bolsillo.descripcion || '',
        saldo: bolsillo.saldo?.toString() || '',
        imagenUrl: bolsillo.imagenUrl || '',
        color: bolsillo.color || '#10b981',
        tipo: bolsillo.tipo || 'Digital',
      });
    } else {
      setForm(emptyForm);
    }
    setPreviewError(false);
  }, [bolsillo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'imagenUrl') setPreviewError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre) return;

    setLoading(true);
    try {
      await onSubmit(form);
      if (!bolsillo) setForm(emptyForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nombre del bolsillo *
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Ahorro viaje, Fondo emergencia"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Saldo inicial
          </label>
          <input
            type="number"
            name="saldo"
            value={form.saldo}
            onChange={handleChange}
            min="0"
            step="1"
            placeholder="0"
            disabled={!!bolsillo}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white disabled:opacity-50"
          />
          {bolsillo && (
            <p className="mt-1 text-xs text-slate-500">Usa "Transferir" para modificar el saldo</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tipo de cuenta
          </label>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, tipo: 'Digital' }))}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                form.tipo === 'Digital'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💳 Digital
            </button>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, tipo: 'Físico' }))}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                form.tipo === 'Físico'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💵 Físico (efectivo)
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">Digital = cuenta bancaria / billetera virtual &bull; Físico = efectivo en mano</p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Descripción
        </label>
        <input
          type="text"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción opcional del bolsillo"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          URL de imagen
        </label>
        <input
          type="url"
          name="imagenUrl"
          value={form.imagenUrl}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
        {form.imagenUrl && !previewError && (
          <div className="mt-2 flex items-center gap-2">
            <img
              src={form.imagenUrl}
              alt="Vista previa"
              className="h-12 w-12 rounded-lg object-cover"
              onError={() => setPreviewError(true)}
            />
            <span className="text-xs text-slate-500">Vista previa</span>
          </div>
        )}
        {previewError && (
          <p className="mt-1 text-xs text-red-500">No se pudo cargar la imagen</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, color: c }))}
              className={`h-8 w-8 rounded-full border-2 transition ${
                form.color === c
                  ? 'border-slate-900 scale-110 dark:border-white'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : bolsillo ? 'Actualizar' : 'Crear bolsillo'}
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
