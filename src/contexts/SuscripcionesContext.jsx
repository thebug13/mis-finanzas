import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { subscribeSuscripciones } from '../services/suscripciones';

const SuscripcionesContext = createContext(null);

function getFirestoreErrorMessage(error) {
  if (error?.code === 'permission-denied') {
    return 'Sin permiso para leer datos. Publica las reglas en Firebase Console → Firestore → Reglas.';
  }
  if (error?.code === 'failed-precondition') {
    return 'Falta un índice en Firestore. Abre la consola del navegador (F12) y sigue el enlace del error.';
  }
  return error?.message || 'Error al conectar con la base de datos';
}

export function SuscripcionesProvider({ children }) {
  const { user } = useAuth();
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setSuscripciones([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeSuscripciones(
      user.uid,
      (data) => {
        setSuscripciones(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setSuscripciones([]);
        setLoading(false);
        setError(getFirestoreErrorMessage(err));
      }
    );

    return unsubscribe;
  }, [user]);

  // Cálculos derivados
  const analisis = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const en7dias = new Date(hoy);
    en7dias.setDate(en7dias.getDate() + 7);

    const activas = suscripciones.filter((s) => s.activo !== false);
    const vencidas = [];
    const proximas = [];
    const hoyMismo = [];

    activas.forEach((s) => {
      const fechaPago = s.proximoPago ? new Date(s.proximoPago + 'T00:00:00') : null;
      if (!fechaPago) return;

      if (fechaPago < hoy) {
        vencidas.push({ ...s, _fechaPago: fechaPago, _estado: 'vencida' });
      } else if (fechaPago.getTime() === hoy.getTime()) {
        hoyMismo.push({ ...s, _fechaPago: fechaPago, _estado: 'hoy' });
      } else if (fechaPago <= en7dias) {
        proximas.push({ ...s, _fechaPago: fechaPago, _estado: 'proxima' });
      }
    });

    // Total mensual estimado (solo activas)
    const totalMensual = activas.reduce((sum, s) => {
      if (s.frecuencia === 'mensual') return sum + s.monto;
      if (s.frecuencia === 'semanal') return sum + s.monto * 4.33;
      if (s.frecuencia === 'bimestral') return sum + s.monto / 2;
      if (s.frecuencia === 'trimestral') return sum + s.monto / 3;
      if (s.frecuencia === 'semestral') return sum + s.monto / 6;
      if (s.frecuencia === 'anual') return sum + s.monto / 12;
      return sum;
    }, 0);

    const totalAnual = totalMensual * 12;

    return {
      activas,
      vencidas,
      proximas,
      hoyMismo,
      totalMensual,
      totalAnual,
      totalAlertas: vencidas.length + hoyMismo.length + proximas.length,
    };
  }, [suscripciones]);

  return (
    <SuscripcionesContext.Provider value={{ suscripciones, loading, error, analisis }}>
      {children}
    </SuscripcionesContext.Provider>
  );
}

export function useSuscripciones() {
  const context = useContext(SuscripcionesContext);
  if (!context) {
    throw new Error('useSuscripciones debe usarse dentro de SuscripcionesProvider');
  }
  return context;
}
