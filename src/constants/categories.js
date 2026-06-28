export const INGRESO_CATEGORIAS = [
  'Nómina',
  'Bonificación',
  'Comisiones',
  'Freelance',
  'Arriendo recibido',
  'Venta de activos',
  'Préstamos recibidos',
  'Subsidios',
  'Otros ingresos',
];

export const GASTO_CATEGORIAS = [
  'Arriendo',
  'Servicios públicos',
  'Mercado',
  'Transporte',
  'Gasolina',
  'Vehículos',
  'Salud',
  'Tecnología',
  'Educación',
  'Entretenimiento',
  'Restaurantes',
  'Ropa y calzado',
  'Deudas',
  'Crédito bancario',
  'Impuestos',
  'Seguros',
  'Familia',
  'Mascotas',
  'Gym y deporte',
  'Otros gastos',
];

export const TIPOS = ['Ingreso', 'Gasto', 'Transferencia'];

export const TRANSFERENCIA_CATEGORIAS = [
  'Retiro cajero',
  'Depósito banco',
  'Envío digital a efectivo',
  'Efectivo a digital',
  'Otro cambio de medio',
];

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
  { path: '/bolsillos', label: 'Bolsillos', icon: 'bolsillos' },
  { path: '/suscripciones', label: 'Suscripciones', icon: 'suscripciones' },
  { path: '/calculadora', label: 'Calculadora', icon: 'calculadora' },
];

export function getCategoriasPorTipo(tipo) {
  if (tipo === 'Ingreso') return INGRESO_CATEGORIAS;
  if (tipo === 'Transferencia') return TRANSFERENCIA_CATEGORIAS;
  return GASTO_CATEGORIAS;
}
