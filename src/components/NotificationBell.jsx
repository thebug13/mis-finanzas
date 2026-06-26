import { useState, useRef, useEffect } from 'react';
import { useNotificaciones } from '../contexts/NotificacionesContext';
import { formatFecha } from '../utils/formatters';

export default function NotificationBell() {
  const { notificaciones, noLeidas, marcarComoLeida, marcarTodasLeidas } = useNotificaciones();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  const getTipoStyles = (tipo) => {
    switch (tipo) {
      case 'vencida':
        return {
          bg: 'bg-red-100 dark:bg-red-950',
          text: 'text-red-700 dark:text-red-300',
          dot: 'bg-red-500',
          label: 'Vencida',
        };
      case 'hoy':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950',
          text: 'text-amber-700 dark:text-amber-300',
          dot: 'bg-amber-500',
          label: 'Hoy',
        };
      case 'proxima':
        return {
          bg: 'bg-blue-100 dark:bg-blue-950',
          text: 'text-blue-700 dark:text-blue-300',
          dot: 'bg-blue-500',
          label: 'Próxima',
        };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500', label: '' };
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Campana */}
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        title="Notificaciones"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {noLeidas > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {/* Panel desplegable */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Notificaciones</h4>
              {noLeidas > 0 && (
                <p className="text-xs text-slate-500">{noLeidas} sin leer</p>
              )}
            </div>
            {noLeidas > 0 && (
              <button
                onClick={marcarTodasLeidas}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Marcar todas
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="max-h-80 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-sm text-slate-500">Todo al día</p>
                <p className="text-xs text-slate-400">No hay pagos pendientes</p>
              </div>
            ) : (
              notificaciones.map((n) => {
                const styles = getTipoStyles(n.tipo);
                return (
                  <button
                    key={n.id}
                    onClick={() => marcarComoLeida(n.id)}
                    className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-750 ${
                      n.leida ? 'opacity-60' : ''
                    }`}
                  >
                    <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${styles.dot}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${styles.bg} ${styles.text}`}>
                          {styles.label}
                        </span>
                        {!n.leida && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                        {n.titulo}
                      </p>
                      <p className="text-xs text-slate-500">{n.mensaje}</p>
                      {n.fecha && (
                        <p className="mt-1 text-[10px] text-slate-400">
                          Fecha: {formatFecha(n.fecha)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
