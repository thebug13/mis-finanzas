# Mis Finanzas

Aplicación web moderna de finanzas personales con React 19, Firebase y PWA instalable.

## Características

- Autenticación con Google (Firebase Auth)
- Datos privados por usuario (Firestore)
- Dashboard con gráficos interactivos (Chart.js)
- CRUD completo de movimientos financieros
- Filtros por mes, año, tipo y categoría
- Exportación a Excel (.xlsx) y CSV
- Presupuesto mensual por categoría con barras de progreso
- Modo oscuro
- Diseño responsive (menú lateral en escritorio, inferior en móvil)
- PWA instalable en Android e iPhone
- Despliegue en GitHub Pages

## Tecnologías

| Tecnología | Uso |
|---|---|
| React 19 | Interfaz de usuario |
| Vite | Build y desarrollo |
| Firebase Auth | Inicio de sesión con Google |
| Firestore | Base de datos en tiempo real |
| React Router | Navegación |
| Chart.js | Gráficos |
| Tailwind CSS 4 | Estilos |
| vite-plugin-pwa | Aplicación instalable |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- Cuenta de [Firebase](https://console.firebase.google.com/)
- Cuenta de Google Cloud (para OAuth)

## Configuración de Firebase

### 1. Crear proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado `mis-finanzas` (o el nombre que prefieras)
3. Habilita **Authentication** → **Sign-in method** → **Google**
4. Crea una base de datos **Firestore** en modo producción

### 2. Registrar aplicación web

1. En la configuración del proyecto, agrega una app web
2. Copia las credenciales de configuración
3. Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Desplegar reglas de Firestore

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Las reglas en `firestore.rules` garantizan que cada usuario solo acceda a sus propios datos.

### 4. Índice compuesto en Firestore

La consulta de movimientos usa `where('uid')` + `orderBy('fecha')`. Firestore te pedirá crear un índice compuesto la primera vez que ejecutes la app. Haz clic en el enlace del error en la consola del navegador para crearlo automáticamente.

### 5. Dominios autorizados (GitHub Pages)

En Firebase Console → Authentication → Settings → Authorized domains, agrega:

- `tu-usuario.github.io`

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/mis-finanzas.git
cd mis-finanzas

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run preview` | Vista previa del build |
| `npm run deploy` | Desplegar a GitHub Pages (manual) |

## Despliegue en GitHub Pages

### Opción A: GitHub Actions (recomendado)

1. Crea un repositorio en GitHub llamado `mis-finanzas`
2. Cambia `base` en `vite.config.js` si tu repositorio tiene otro nombre:

```js
const base = process.env.GITHUB_PAGES === 'true' ? '/nombre-repo/' : '/';
```

3. En GitHub → Settings → Pages → Source: **GitHub Actions**
4. Agrega los secrets de Firebase en Settings → Secrets and variables → Actions:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Haz push a la rama `main` — el workflow desplegará automáticamente

### Opción B: Despliegue manual

```bash
GITHUB_PAGES=true npm run build
npm run deploy
```

## Estructura del proyecto

```
mis-finanzas/
├── public/              # Assets estáticos e iconos PWA
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── constants/       # Categorías y constantes
│   ├── contexts/        # Auth, tema y movimientos
│   ├── hooks/           # Hooks personalizados
│   ├── pages/           # Dashboard, Movimientos, Presupuesto
│   ├── services/        # Firebase y Firestore
│   └── utils/           # Cálculos, formato y exportación
├── firestore.rules      # Reglas de seguridad
├── firebase.json        # Configuración Firebase
└── vite.config.js       # Vite + PWA + Tailwind
```

## Colecciones de Firestore

### `movimientos`

| Campo | Tipo | Descripción |
|---|---|---|
| uid | string | ID del usuario autenticado |
| fecha | string | Fecha del movimiento (YYYY-MM-DD) |
| tipo | string | "Ingreso" o "Gasto" |
| categoria | string | Categoría del movimiento |
| concepto | string | Descripción |
| valor | number | Monto |
| createdAt | timestamp | Fecha de creación |

### `presupuestos`

| Campo | Tipo | Descripción |
|---|---|---|
| uid | string | ID del usuario |
| mes | number | Mes (1-12) |
| anio | number | Año |
| categorias | map | Metas por categoría de gasto |
| updatedAt | timestamp | Última actualización |

## Categorías

**Ingresos:** Nómina, Bonificación, Comisiones, Venta de activos, Préstamos, Otros ingresos

**Gastos:** Vivienda, Servicios públicos, Mercado, Transporte, Vehículos, Salud, Tecnología, Educación, Entretenimiento, Deudas, Impuestos, Familia, Otros gastos

## PWA — Instalación

### Android (Chrome)
1. Abre la app en Chrome
2. Toca el menú ⋮ → "Instalar aplicación" o "Agregar a pantalla de inicio"

### iPhone (Safari)
1. Abre la app en Safari
2. Toca el botón Compartir → "Agregar a pantalla de inicio"

## Licencia

MIT
