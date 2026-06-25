/**
 * Formatea un número como moneda en pesos colombianos (COP).
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

/**
 * Convierte fecha de Firestore o string a objeto Date.
 */
export function parseFecha(fecha) {
  if (!fecha) return new Date();
  if (fecha.toDate) return fecha.toDate();
  // Evita desfase de zona horaria con fechas YYYY-MM-DD
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const [y, m, d] = fecha.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(fecha);
}

/**
 * Formatea fecha para mostrar en la UI.
 */
export function formatFecha(fecha) {
  return parseFecha(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Convierte Date a string YYYY-MM-DD para inputs type="date".
 */
export function toInputDate(fecha) {
  const d = parseFecha(fecha);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Obtiene mes y año de una fecha.
 */
export function getMesAnio(fecha) {
  const d = parseFecha(fecha);
  return { mes: d.getMonth() + 1, anio: d.getFullYear() };
}
