import { parseFecha } from './formatters';

/**
 * Filtra movimientos según criterios seleccionados.
 */
export function filterMovimientos(movimientos, filters) {
  const { mes, anio, tipo, categoria, medio } = filters;

  return movimientos.filter((m) => {
    const fecha = parseFecha(m.fecha);
    const mMes = fecha.getMonth() + 1;
    const mAnio = fecha.getFullYear();

    if (mes && mMes !== Number(mes)) return false;
    if (anio && mAnio !== Number(anio)) return false;
    if (tipo && m.tipo !== tipo) return false;
    if (categoria && m.categoria !== categoria) return false;
    if (medio && (m.medio || 'Digital') !== medio) return false;

    return true;
  });
}

/**
 * Calcula totales de ingresos, gastos y balance.
 * Excluye Transferencias (cambio de medio) de los cálculos.
 */
export function calcularTotales(movimientos) {
  const ingresos = movimientos
    .filter((m) => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + Number(m.valor), 0);

  const gastos = movimientos
    .filter((m) => m.tipo === 'Gasto')
    .reduce((sum, m) => sum + Number(m.valor), 0);

  const transferencias = movimientos
    .filter((m) => m.tipo === 'Transferencia')
    .reduce((sum, m) => sum + Number(m.valor), 0);

  return {
    ingresos,
    gastos,
    balance: ingresos - gastos,
    cantidad: movimientos.length,
    transferencias,
  };
}

/**
 * Agrupa gastos por categoría.
 */
export function gastosPorCategoria(movimientos) {
  const gastos = movimientos.filter((m) => m.tipo === 'Gasto');
  const map = {};

  gastos.forEach((m) => {
    map[m.categoria] = (map[m.categoria] || 0) + Number(m.valor);
  });

  return Object.entries(map)
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Agrupa ingresos y gastos por mes para gráfico de evolución.
 */
export function evolucionMensual(movimientos) {
  const map = {};

  movimientos.forEach((m) => {
    const fecha = parseFecha(m.fecha);
    const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

    if (!map[key]) {
      map[key] = { mes: key, ingresos: 0, gastos: 0 };
    }

    if (m.tipo === 'Ingreso') {
      map[key].ingresos += Number(m.valor);
    } else {
      map[key].gastos += Number(m.valor);
    }
  });

  return Object.values(map).sort((a, b) => a.mes.localeCompare(b.mes));
}

/**
 * Calcula gasto real por categoría en un mes/año.
 */
export function gastoRealPorCategoria(movimientos, mes, anio) {
  const map = {};

  movimientos
    .filter((m) => {
      if (m.tipo !== 'Gasto') return false;
      const fecha = parseFecha(m.fecha);
      return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
    })
    .forEach((m) => {
      map[m.categoria] = (map[m.categoria] || 0) + Number(m.valor);
    });

  return map;
}
