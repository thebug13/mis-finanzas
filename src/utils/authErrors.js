/**
 * Mensajes de error de Firebase Auth en español.
 */
export function getAuthErrorMessage(error) {
  const code = error?.code || '';

  const messages = {
    'auth/operation-not-allowed':
      'Google no está activado en Firebase. Ve a Authentication → Sign-in method → Google → Habilitar.',
    'auth/unauthorized-domain':
      'Dominio no autorizado. En Firebase → Authentication → Settings → Authorized domains, agrega "localhost".',
    'auth/popup-blocked':
      'El navegador bloqueó la ventana emergente. Permite popups para localhost o usa el botón de nuevo (intentará redirección).',
    'auth/popup-closed-by-user':
      'Cerraste la ventana de Google. Intenta de nuevo.',
    'auth/cancelled-popup-request':
      'Espera a que termine el intento anterior e intenta de nuevo.',
    'auth/network-request-failed':
      'Sin conexión a internet. Verifica tu red.',
    'auth/invalid-api-key':
      'API key inválida. Copia de nuevo las credenciales desde Firebase Console → Configuración del proyecto → Tu app web.',
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      'API key no válida. Ve a Firebase Console, copia la config completa al archivo .env y reinicia el servidor.',
    'auth/account-exists-with-different-credential':
      'Ya existe una cuenta con ese email usando otro método de inicio de sesión.',
  };

  return messages[code] || error?.message || 'Error desconocido al iniciar sesión.';
}

/**
 * Verifica que las variables de entorno de Firebase estén cargadas.
 */
export function validateFirebaseConfig() {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('Faltan variables en .env:', missing.join(', '));
    return false;
  }

  return true;
}
