import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDocs,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'bolsillos';

/**
 * Escucha en tiempo real los bolsillos del usuario autenticado.
 */
export function subscribeBolsillos(uid, callback, onError) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const bolsillos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(bolsillos);
    },
    (error) => {
      console.error('Error al cargar bolsillos:', error.code, error.message);
      onError?.(error);
    }
  );
}

export async function createBolsillo(uid, data) {
  return addDoc(collection(db, COLLECTION), {
    uid,
    nombre: data.nombre,
    descripcion: data.descripcion || '',
    saldo: Number(data.saldo) || 0,
    imagenUrl: data.imagenUrl || '',
    color: data.color || '#10b981',
    createdAt: serverTimestamp(),
  });
}

export async function updateBolsillo(id, data) {
  const ref = doc(db, COLLECTION, id);
  return updateDoc(ref, {
    nombre: data.nombre,
    descripcion: data.descripcion || '',
    imagenUrl: data.imagenUrl || '',
    color: data.color || '#10b981',
  });
}

export async function deleteBolsillo(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Actualiza el saldo de un bolsillo (positivo = agregar, negativo = quitar).
 */
export async function actualizarSaldoBolsillo(id, monto) {
  const ref = doc(db, COLLECTION, id);
  return updateDoc(ref, {
    saldo: increment(Number(monto)),
  });
}

export async function getBolsillos(uid) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
