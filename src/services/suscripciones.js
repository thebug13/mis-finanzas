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

const COLLECTION = 'suscripciones';

export const FRECUENCIAS = [
  { value: 'semanal', label: 'Semanal', dias: 7 },
  { value: 'mensual', label: 'Mensual', dias: 30 },
  { value: 'bimestral', label: 'Bimestral', dias: 60 },
  { value: 'trimestral', label: 'Trimestral', dias: 90 },
  { value: 'semestral', label: 'Semestral', dias: 180 },
  { value: 'anual', label: 'Anual', dias: 365 },
];

export const CATEGORIAS_SUSCRIPCION = [
  'Streaming',
  'Música',
  'Software',
  'Internet',
  'Telefonía',
  'Electricidad',
  'Agua',
  'Gas',
  'Seguros',
  'Gimnasio',
  'Educación',
  'Gaming',
  'Almacenamiento',
  'Otros',
];

/**
 * Calcula la próxima fecha de pago según la frecuencia.
 */
export function calcularProximoPago(fechaActual, frecuencia) {
  const fecha = new Date(fechaActual);
  const freq = FRECUENCIAS.find((f) => f.value === frecuencia);
  if (!freq) return fecha;

  if (frecuencia === 'mensual') {
    fecha.setMonth(fecha.getMonth() + 1);
  } else if (frecuencia === 'bimestral') {
    fecha.setMonth(fecha.getMonth() + 2);
  } else if (frecuencia === 'trimestral') {
    fecha.setMonth(fecha.getMonth() + 3);
  } else if (frecuencia === 'semestral') {
    fecha.setMonth(fecha.getMonth() + 6);
  } else if (frecuencia === 'anual') {
    fecha.setFullYear(fecha.getFullYear() + 1);
  } else {
    fecha.setDate(fecha.getDate() + freq.dias);
  }

  return fecha;
}

/**
 * Escucha en tiempo real las suscripciones del usuario.
 */
export function subscribeSuscripciones(uid, callback, onError) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const suscripciones = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(suscripciones);
    },
    (error) => {
      console.error('Error al cargar suscripciones:', error.code, error.message);
      onError?.(error);
    }
  );
}

export async function createSuscripcion(uid, data) {
  return addDoc(collection(db, COLLECTION), {
    uid,
    nombre: data.nombre,
    monto: Number(data.monto),
    frecuencia: data.frecuencia,
    categoria: data.categoria,
    proximoPago: data.proximoPago,
    diaPago: Number(data.diaPago) || null,
    activo: true,
    proveedor: data.proveedor || '',
    notas: data.notas || '',
    createdAt: serverTimestamp(),
  });
}

export async function updateSuscripcion(id, data) {
  const ref = doc(db, COLLECTION, id);
  return updateDoc(ref, {
    nombre: data.nombre,
    monto: Number(data.monto),
    frecuencia: data.frecuencia,
    categoria: data.categoria,
    proximoPago: data.proximoPago,
    diaPago: Number(data.diaPago) || null,
    proveedor: data.proveedor || '',
    notas: data.notas || '',
  });
}

export async function deleteSuscripcion(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Marca una suscripción como pagada y avanza la fecha de próximo pago.
 */
export async function marcarComoPagado(id, suscripcion) {
  const proximoPago = calcularProximoPago(suscripcion.proximoPago, suscripcion.frecuencia);
  const ref = doc(db, COLLECTION, id);
  return updateDoc(ref, {
    proximoPago: proximoPago.toISOString().split('T')[0],
  });
}

/**
 * Activa o desactiva una suscripción.
 */
export async function toggleSuscripcion(id, activo) {
  const ref = doc(db, COLLECTION, id);
  return updateDoc(ref, { activo });
}

export async function getSuscripciones(uid) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
