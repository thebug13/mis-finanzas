import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function useChartColors() {
  const { darkMode } = useTheme();
  return {
    text: darkMode ? '#94a3b8' : '#64748b',
    grid: darkMode ? '#334155' : '#e2e8f0',
  };
}

const CHART_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#a855f7', '#eab308',
];

export function IngresosVsGastosChart({ ingresos, gastos }) {
  const colors = useChartColors();

  const data = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [{
      data: [ingresos, gastos],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: colors.text },
      },
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function GastosPorCategoriaChart({ data }) {
  const colors = useChartColors();

  const chartData = {
    labels: data.map((d) => d.categoria),
    datasets: [{
      data: data.map((d) => d.total),
      backgroundColor: CHART_COLORS.slice(0, data.length),
      borderWidth: 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: colors.text, boxWidth: 12, font: { size: 11 } },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Sin datos de gastos
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export function EvolucionMensualChart({ data }) {
  const colors = useChartColors();

  const chartData = {
    labels: data.map((d) => d.mes),
    datasets: [
      {
        label: 'Ingresos',
        data: data.map((d) => d.ingresos),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Gastos',
        data: data.map((d) => d.gastos),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: colors.text },
      },
    },
    scales: {
      x: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
      },
      y: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Sin datos de evolución
      </div>
    );
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}

export function PresupuestoBarChart({ categorias, gastosReales }) {
  const colors = useChartColors();

  const labels = [...new Set([
    ...Object.keys(categorias).filter((c) => categorias[c] > 0),
    ...Object.keys(gastosReales).filter((c) => gastosReales[c] > 0),
  ])];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Presupuesto',
        data: labels.map((c) => categorias[c] || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'Gasto real',
        data: labels.map((c) => gastosReales[c] || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: colors.text },
      },
    },
    scales: {
      x: {
        ticks: { color: colors.text, maxRotation: 45 },
        grid: { color: colors.grid },
      },
      y: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
      },
    },
  };

  if (labels.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Registra gastos o define metas de presupuesto para ver el gráfico
      </div>
    );
  }

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
}
