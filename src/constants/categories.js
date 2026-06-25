export const INGRESO_CATEGORIAS = [
  'Nómina',
  'Bonificación',
  'Comisiones',
  'Venta de activos',
  'Préstamos',
  'Otros ingresos',
];

export const GASTO_CATEGORIAS = [
  'Vivienda',
  'Servicios públicos',
  'Mercado',
  'Transporte',
  'Vehículos',
  'Salud',
  'Tecnología',
  'Educación',
  'Entretenimiento',
  'Deudas',
  'Impuestos',
  'Familia',
  'Otros gastos',
];

export const TIPOS = ['Ingreso', 'Gasto'];

export const MESES = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/movimientos', label: 'Movimientos', icon: 'movimientos' },
  { path: '/presupuesto', label: 'Presupuesto', icon: 'presupuesto' },
];

export function getCategoriasPorTipo(tipo) {
  return tipo === 'Ingreso' ? INGRESO_CATEGORIAS : GASTO_CATEGORIAS;
}
