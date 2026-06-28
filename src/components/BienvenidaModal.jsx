import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function getSaludo() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { texto: '¡Buenos días', emoji: '☀️' };
  if (h >= 12 && h < 18) return { texto: '¡Buenas tardes', emoji: '🌤️' };
  return { texto: '¡Buenas noches', emoji: '🌙' };
}

function getFrase() {
  const frases = [
    'Cada peso bien gestionado es un paso hacia tu libertad financiera.',
    'El control de tus finanzas empieza con un registro diario.',
    'Ahorrar hoy es invertir en tu futuro.',
    'Conocer en qué gastas es el primer paso para gastar mejor.',
    'Tu bienestar económico depende de pequeñas decisiones diarias.',
    'Hoy es un buen día para revisar cómo va tu mes.',
  ];
  return frases[new Date().getDay() % frases.length];
}

const STORAGE_KEY = 'mf_bienvenida_last';

export default function BienvenidaModal() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    const last = localStorage.getItem(STORAGE_KEY);
    const hoy = new Date().toDateString();
    if (last !== hoy) {
      setVisible(true);
      localStorage.setItem(STORAGE_KEY, hoy);
    }
  }, [user]);

  if (!visible || !user) return null;

  const { texto, emoji } = getSaludo();
  const nombre = user.displayName?.split(' ')[0] || 'amigo';
  const frase = getFrase();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Franja superior decorativa */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500" />

        <div className="p-8 text-center">
          {/* Emoji + foto */}
          <div className="relative mx-auto mb-4 w-fit">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="h-20 w-20 rounded-full ring-4 ring-emerald-100 dark:ring-emerald-900"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-900">
                👤
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 text-2xl">{emoji}</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {texto}, {nombre}!
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="my-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700">
            <p className="text-sm italic text-slate-600 dark:text-slate-300">"{frase}"</p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Mis Finanzas</p>
              <p className="text-lg">💰</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950">
              <p className="text-xs text-blue-600 dark:text-blue-400">Bolsillos</p>
              <p className="text-lg">👛</p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-950">
              <p className="text-xs text-purple-600 dark:text-purple-400">Pagos</p>
              <p className="text-lg">📅</p>
            </div>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
