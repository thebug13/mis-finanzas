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
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'movimientos';

function sortByFechaDesc(docs) {
  return docs.sort((a, b) => {
    const fa = a.fecha?.toDate ? a.fecha.toDate() : new Date(a.fecha);
    const fb = b.fecha?.toDate ? b.fecha.toDate() : new Date(b.fecha);
    return fb - fa;
  });
}

/**
 * Escucha en tiempo real los movimientos del usuario autenticado.
 * Ordena en cliente para no depender de índice compuesto en Firestore.
 */
export function subscribeMovimientos(uid, callback, onError) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const movimientos = sortByFechaDesc(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
      callback(movimientos);
    },
    (error) => {
      console.error('Error al cargar movimientos:', error.code, error.message);
      onError?.(error);
    }
  );
}

export async function createMovimiento(uid, data) {
  return addDoc(collection(db, COLLECTION), {
    uid,
    fecha: data.fecha,
    tipo: data.tipo,
    categoria: data.categoria,
    concepto: data.concepto,
    valor: Number(data.valor),
    medio: data.medio || 'Digital',
    createdAt: serverTimestamp(),
  });
}

export async function updateMovimiento(id, data) {
  const ref = doc(db, COLLECTION, id);
  return updateDoc(ref, {
    fecha: data.fecha,
    tipo: data.tipo,
    categoria: data.categoria,
    concepto: data.concepto,
    valor: Number(data.valor),
    medio: data.medio || 'Digital',
  });
}

export async function deleteMovimiento(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}

export async function getMovimientos(uid) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return sortByFechaDesc(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
}
