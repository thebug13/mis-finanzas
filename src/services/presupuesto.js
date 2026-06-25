import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'presupuestos';

function presupuestoDocId(uid, mes, anio) {
  return `${uid}_${anio}_${mes}`;
}

/**
 * Escucha el presupuesto mensual del usuario para un mes/año específico.
 */
export function subscribePresupuesto(uid, mes, anio, callback, onError) {
  const id = presupuestoDocId(uid, mes, anio);
  const ref = doc(db, COLLECTION, id);

  return onSnapshot(
    ref,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        callback({ categorias: {} });
      }
    },
    (error) => {
      console.error('Error al cargar presupuesto:', error.code, error.message);
      onError?.(error);
    }
  );
}

export async function savePresupuesto(uid, mes, anio, categorias) {
  const id = presupuestoDocId(uid, mes, anio);
  const ref = doc(db, COLLECTION, id);
  return setDoc(
    ref,
    {
      uid,
      mes,
      anio,
      categorias,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
