# Guía de configuración — Mis Finanzas

Sigue estos pasos en orden.

---

## Paso 1: Instalar herramientas (si no las tienes)

### Node.js
Descarga e instala desde: https://nodejs.org/ (versión LTS)

### Git
Descarga e instala desde: https://git-scm.com/download/win

Cierra y vuelve a abrir la terminal después de instalar.

Verifica:
```powershell
node --version
npm --version
git --version
```

---

## Paso 2: Configurar Firebase

### 2.1 Crear proyecto

1. Ve a https://console.firebase.google.com/
2. Clic en **"Agregar proyecto"**
3. Nombre: `mis-finanzas` (o el que prefieras)
4. Desactiva Google Analytics si no lo necesitas → **Crear proyecto**

### 2.2 Habilitar autenticación con Google

1. Menú lateral → **Authentication** → **Comenzar**
2. Pestaña **Sign-in method**
3. Clic en **Google** → Activar → Elegir email de soporte → **Guardar**

### 2.3 Crear base de datos Firestore

1. Menú lateral → **Firestore Database** → **Crear base de datos**
2. Modo: **Producción**
3. Ubicación: la más cercana (ej. `southamerica-east1`)
4. **Habilitar**

### 2.4 Registrar app web

1. En la página principal del proyecto → icono **</>** (Web)
2. Nombre de la app: `Mis Finanzas`
3. **No** marques Firebase Hosting por ahora
4. Clic en **Registrar app**
5. Copia el objeto `firebaseConfig` que aparece

### 2.5 Crear archivo .env

En la raíz del proyecto, crea el archivo `.env` con tus valores:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=mis-finanzas-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mis-finanzas-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=mis-finanzas-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

> **Importante:** El archivo `.env` nunca se sube a GitHub (está en `.gitignore`).

### 2.6 Desplegar reglas de seguridad

```powershell
npm install -g firebase-tools
firebase login
firebase use --add
# Selecciona tu proyecto mis-finanzas
firebase deploy --only firestore
```

### 2.7 Crear índice de Firestore

La primera vez que uses la app, Firestore mostrará un error en la consola del navegador con un enlace para crear el índice. Haz clic en ese enlace y espera 1-2 minutos.

O despliega el índice manualmente:
```powershell
firebase deploy --only firestore:indexes
```

---

## Paso 3: Probar en local

```powershell
cd "d:\Ultimo proyecto"
npm install
npm run dev
```

Abre http://localhost:5173 → Inicia sesión con Google.

---

## Paso 4: Subir a GitHub

### 4.1 Crear repositorio

1. Ve a https://github.com/new
2. Nombre del repositorio: `mis-finanzas`
3. Público → **No** inicialices con README (ya lo tienes)
4. Clic en **Create repository**

### 4.2 Subir el código

```powershell
cd "d:\Ultimo proyecto"
git init
git add .
git commit -m "Aplicación Mis Finanzas - finanzas personales con React y Firebase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mis-finanzas.git
git push -u origin main
```

Reemplaza `TU_USUARIO` por tu nombre de usuario de GitHub.

### 4.3 Si tu repo tiene otro nombre

Edita `vite.config.js` línea 7:
```js
const base = process.env.GITHUB_PAGES === 'true' ? '/nombre-de-tu-repo/' : '/';
```

---

## Paso 5: Desplegar en GitHub Pages

### 5.1 Agregar secrets en GitHub

1. Tu repo → **Settings** → **Secrets and variables** → **Actions**
2. Clic en **New repository secret** para cada uno:

| Nombre del secret | Valor |
|---|---|
| `VITE_FIREBASE_API_KEY` | Tu API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | tu-proyecto.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | tu-proyecto-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | tu-proyecto.appspot.com |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 123456789 |
| `VITE_FIREBASE_APP_ID` | 1:123:web:abc |

### 5.2 Activar GitHub Pages

1. Repo → **Settings** → **Pages**
2. Source: **GitHub Actions**

### 5.3 Desplegar

Haz push a `main` o ve a **Actions** → **Deploy to GitHub Pages** → **Run workflow**

Tu app estará en: `https://TU_USUARIO.github.io/mis-finanzas/`

### 5.4 Autorizar dominio en Firebase

1. Firebase Console → **Authentication** → **Settings**
2. Pestaña **Authorized domains**
3. Agrega: `TU_USUARIO.github.io`

---

## Paso 6: Instalar como PWA

### Android (Chrome)
Menú ⋮ → **Instalar aplicación**

### iPhone (Safari)
Botón Compartir → **Agregar a pantalla de inicio**

---

## Solución de problemas

| Problema | Solución |
|---|---|
| Error al iniciar sesión | Verifica dominios autorizados en Firebase Auth |
| Pantalla en blanco en GitHub Pages | Revisa que `base` en vite.config.js coincida con el nombre del repo |
| Error de índice en Firestore | Haz clic en el enlace del error o ejecuta `firebase deploy --only firestore:indexes` |
| `npm` no reconocido | Reinstala Node.js y reinicia la terminal |
| Variables no cargan en deploy | Verifica que los 6 secrets estén en GitHub Actions |

---

## Checklist final

- [ ] Node.js instalado
- [ ] Git instalado
- [ ] Proyecto Firebase creado
- [ ] Google Auth habilitado
- [ ] Firestore creado
- [ ] Archivo `.env` configurado
- [ ] Reglas de Firestore desplegadas
- [ ] App funciona en localhost
- [ ] Código en GitHub
- [ ] Secrets configurados en GitHub
- [ ] GitHub Pages activado
- [ ] Dominio github.io autorizado en Firebase
