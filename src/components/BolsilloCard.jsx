import { formatCurrency } from '../utils/formatters';

export default function BolsilloCard({ bolsillo, onEdit, onDelete, onTransferir, deleteId }) {
  const { id, nombre, descripcion, saldo, imagenUrl, color, tipo } = bolsillo;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {/* Imagen o fondo con color */}
      <div
        className="relative flex h-32 items-center justify-center overflow-hidden"
        style={{ backgroundColor: imagenUrl ? 'transparent' : (color || '#10b981') }}
      >
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={nombre}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.backgroundColor = color || '#10b981';
            }}
          />
        ) : (
          <svg className="h-16 w-16 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
          </svg>
        )}
        {/* Badge de tipo en esquina superior izquierda */}
        <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium shadow ${
          tipo === 'Físico'
            ? 'bg-amber-500 text-white'
            : 'bg-blue-600 text-white'
        }`}>
          {tipo === 'Físico' ? '💵 Físico' : '💳 Digital'}
        </span>
        {/* Overlay con acciones */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(bolsillo)}
            className="rounded-lg bg-white/90 p-1.5 text-slate-600 shadow-sm hover:bg-white"
            title="Editar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(id)}
            className={`rounded-lg p-1.5 shadow-sm ${
              deleteId === id
                ? 'bg-red-600 text-white'
                : 'bg-white/90 text-red-500 hover:bg-red-50'
            }`}
            title={deleteId === id ? 'Confirmar eliminación' : 'Eliminar'}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">{nombre}</h3>
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: color || '#10b981' }}
          />
        </div>
        {descripcion && (
          <p className="mb-3 text-xs text-slate-500 line-clamp-2">{descripcion}</p>
        )}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500">Saldo</p>
            <p className={`text-xl font-bold ${saldo < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {formatCurrency(saldo)}
            </p>
          </div>
          <button
            onClick={() => onTransferir(bolsillo)}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
}
