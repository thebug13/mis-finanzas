import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeBolsillos } from '../services/bolsillos';

const BolsillosContext = createContext(null);

function getFirestoreErrorMessage(error) {
  if (error?.code === 'permission-denied') {
    return 'Sin permiso para leer datos. Publica las reglas en Firebase Console → Firestore → Reglas.';
  }
  if (error?.code === 'failed-precondition') {
    return 'Falta un índice en Firestore. Abre la consola del navegador (F12) y sigue el enlace del error.';
  }
  return error?.message || 'Error al conectar con la base de datos';
}

export function BolsillosProvider({ children }) {
  const { user } = useAuth();
  const [bolsillos, setBolsillos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setBolsillos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeBolsillos(
      user.uid,
      (data) => {
        setBolsillos(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setBolsillos([]);
        setLoading(false);
        setError(getFirestoreErrorMessage(err));
      }
    );

    return unsubscribe;
  }, [user]);

  return (
    <BolsillosContext.Provider value={{ bolsillos, loading, error }}>
      {children}
    </BolsillosContext.Provider>
  );
}

export function useBolsillos() {
  const context = useContext(BolsillosContext);
  if (!context) {
    throw new Error('useBolsillos debe usarse dentro de BolsillosProvider');
  }
  return context;
}
