import { formatCurrency, formatFecha } from '../utils/formatters';
import { FRECUENCIAS } from '../services/suscripciones';

export default function SuscripcionCard({ suscripcion, onEdit, onDelete, onMarcarPagado, onToggle, deleteId }) {
  const { id, nombre, monto, frecuencia, categoria, proximoPago, activo, proveedor } = suscripcion;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaPago = proximoPago ? new Date(proximoPago + 'T00:00:00') : null;
  const estaVencida = fechaPago && fechaPago < hoy;
  const esHoy = fechaPago && fechaPago.getTime() === hoy.getTime();
  const diasRestantes = fechaPago
    ? Math.ceil((fechaPago - hoy) / (1000 * 60 * 60 * 24))
    : null;

  const freqLabel = FRECUENCIAS.find((f) => f.value === frecuencia)?.label || frecuencia;

  const getEstadoBadge = () => {
    if (!activo) {
      return <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">Pausada</span>;
    }
    if (estaVencida) {
      return <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">Vencida</span>;
    }
    if (esHoy) {
      return <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">Vence hoy</span>;
    }
    if (diasRestantes <= 7) {
      return <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">{diasRestantes} días</span>;
    }
    return <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Al día</span>;
  };

  return (
    <div className={`rounded-2xl border bg-white p-5 transition dark:bg-slate-800 ${
      estaVencida
        ? 'border-red-200 dark:border-red-900'
        : esHoy
        ? 'border-amber-200 dark:border-amber-900'
        : 'border-slate-200 dark:border-slate-700'
    }`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900 dark:text-white">{nombre}</h3>
            {getEstadoBadge()}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-700">{categoria}</span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-700">{freqLabel}</span>
            {proveedor && <span>{proveedor}</span>}
          </div>
        </div>
        <p className={`text-lg font-bold ${
          !activo ? 'text-slate-400' : 'text-slate-900 dark:text-white'
        }`}>
          {formatCurrency(monto)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {fechaPago ? (
            <span>
              Próximo pago:{' '}
              <span className={`font-medium ${
                estaVencida ? 'text-red-600 dark:text-red-400' : esHoy ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {formatFecha(proximoPago)}
              </span>
            </span>
          ) : (
            <span>Sin fecha de pago</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {activo && (
            <button
              onClick={() => onMarcarPagado(suscripcion)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
              title="Marcar como pagado"
            >
              Pagado
            </button>
          )}
          <button
            onClick={() => onToggle(id, !activo)}
            className={`rounded-lg px-2 py-1 text-xs font-medium ${
              activo
                ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950'
                : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950'
            }`}
            title={activo ? 'Pausar' : 'Activar'}
          >
            {activo ? 'Pausar' : 'Activar'}
          </button>
          <button
            onClick={() => onEdit(suscripcion)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(id)}
            className={`rounded-lg px-2 py-1 text-xs font-medium ${
              deleteId === id
                ? 'bg-red-600 text-white'
                : 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950'
            }`}
          >
            {deleteId === id ? 'Confirmar' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
