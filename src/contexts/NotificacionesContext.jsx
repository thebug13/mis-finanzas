import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useSuscripciones } from './SuscripcionesContext';

const NotificacionesContext = createContext(null);

export function NotificacionesProvider({ children }) {
  const { analisis } = useSuscripciones();
  const [leidas, setLeidas] = useState(new Set());

  const notificaciones = useMemo(() => {
    const lista = [];

    analisis.vencidas.forEach((s) => {
      lista.push({
        id: `vencida-${s.id}`,
        suscripcionId: s.id,
        tipo: 'vencida',
        titulo: `${s.nombre} está vencida`,
        mensaje: `El pago de ${s.nombre} venció. Monto: $${s.monto?.toLocaleString()}`,
        fecha: s.proximoPago,
        leida: leidas.has(`vencida-${s.id}`),
      });
    });

    analisis.hoyMismo.forEach((s) => {
      lista.push({
        id: `hoy-${s.id}`,
        suscripcionId: s.id,
        tipo: 'hoy',
        titulo: `${s.nombre} vence hoy`,
        mensaje: `Hoy vence el pago de ${s.nombre}. Monto: $${s.monto?.toLocaleString()}`,
        fecha: s.proximoPago,
        leida: leidas.has(`hoy-${s.id}`),
      });
    });

    analisis.proximas.forEach((s) => {
      const dias = Math.ceil(
        (new Date(s.proximoPago + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24)
      );
      lista.push({
        id: `proxima-${s.id}`,
        suscripcionId: s.id,
        tipo: 'proxima',
        titulo: `${s.nombre} vence pronto`,
        mensaje: `Vence en ${dias} día${dias !== 1 ? 's' : ''}. Monto: $${s.monto?.toLocaleString()}`,
        fecha: s.proximoPago,
        leida: leidas.has(`proxima-${s.id}`),
      });
    });

    // Ordenar: vencidas primero, luego hoy, luego próximas
    const orden = { vencida: 0, hoy: 1, proxima: 2 };
    lista.sort((a, b) => (orden[a.tipo] ?? 3) - (orden[b.tipo] ?? 3));

    return lista;
  }, [analisis, leidas]);

  const noLeidas = useMemo(
    () => notificaciones.filter((n) => !n.leida).length,
    [notificaciones]
  );

  const marcarComoLeida = useCallback((id) => {
    setLeidas((prev) => {
      const nuevo = new Set(prev);
      nuevo.add(id);
      return nuevo;
    });
  }, []);

  const marcarTodasLeidas = useCallback(() => {
    setLeidas((prev) => {
      const nuevo = new Set(prev);
      notificaciones.forEach((n) => nuevo.add(n.id));
      return nuevo;
    });
  }, [notificaciones]);

  return (
    <NotificacionesContext.Provider
      value={{ notificaciones, noLeidas, marcarComoLeida, marcarTodasLeidas }}
    >
      {children}
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  const context = useContext(NotificacionesContext);
  if (!context) {
    throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider');
  }
  return context;
}
