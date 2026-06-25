import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeMovimientos } from '../services/movimientos';

const MovimientosContext = createContext(null);

function getFirestoreErrorMessage(error) {
  if (error?.code === 'permission-denied') {
    return 'Sin permiso para leer datos. Ejecuta publicar-reglas.bat (doble clic) para publicar las reglas en Firebase Console.';
  }
  if (error?.code === 'failed-precondition') {
    return 'Falta un índice en Firestore. Abre la consola del navegador (F12) y sigue el enlace del error.';
  }
  return error?.message || 'Error al conectar con la base de datos';
}

export function MovimientosProvider({ children }) {
  const { user } = useAuth();
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setMovimientos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeMovimientos(
      user.uid,
      (data) => {
        setMovimientos(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setMovimientos([]);
        setLoading(false);
        setError(getFirestoreErrorMessage(err));
      }
    );

    return unsubscribe;
  }, [user]);

  return (
    <MovimientosContext.Provider value={{ movimientos, loading, error }}>
      {children}
    </MovimientosContext.Provider>
  );
}

export function useMovimientos() {
  const context = useContext(MovimientosContext);
  if (!context) {
    throw new Error('useMovimientos debe usarse dentro de MovimientosProvider');
  }
  return context;
}
