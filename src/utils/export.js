import * as XLSX from 'xlsx';
import { formatFecha } from './formatters';

/**
 * Exporta movimientos a archivo Excel (.xlsx).
 */
export function exportToExcel(movimientos, filename = 'movimientos') {
  const data = movimientos.map((m) => ({
    Fecha: formatFecha(m.fecha),
    Tipo: m.tipo,
    Categoría: m.categoria,
    Concepto: m.concepto,
    Valor: m.valor,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Exporta movimientos a archivo CSV.
 */
export function exportToCSV(movimientos, filename = 'movimientos') {
  const headers = ['Fecha', 'Tipo', 'Categoría', 'Concepto', 'Valor'];
  const rows = movimientos.map((m) => [
    formatFecha(m.fecha),
    m.tipo,
    m.categoria,
    `"${m.concepto.replace(/"/g, '""')}"`,
    m.valor,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
