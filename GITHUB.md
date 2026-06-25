# Guía: Subir a GitHub y publicar la app

Tu app quedará en: `https://TU_USUARIO.github.io/mis-finanzas/`

---

## Paso 1 — Crear repositorio en GitHub

1. Entra a https://github.com/new
2. **Repository name:** `mis-finanzas`
3. **Public**
4. **NO** marques "Add a README"
5. Clic en **Create repository**

---

## Paso 2 — Subir el código

### Opción fácil (Windows)

Doble clic en **`subir-github.bat`** y sigue las instrucciones.

### Opción manual (terminal)

```powershell
cd "D:\Ultimo proyecto"

git add .
git commit -m "Mis Finanzas - app de finanzas personales con React y Firebase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mis-finanzas.git
git push -u origin main
```

Reemplaza `TU_USUARIO` por tu usuario de GitHub.

> Si Git pide login, usa tu cuenta de GitHub o un [Personal Access Token](https://github.com/settings/tokens).

---

## Paso 3 — Agregar secrets de Firebase

El archivo `.env` **no se sube** a GitHub (está protegido). Debes copiar los valores a GitHub Secrets:

1. Ve a tu repo → **Settings** → **Secrets and variables** → **Actions**
2. Clic en **New repository secret** para cada uno:

| Secret | Valor (copia de tu `.env`) |
|--------|---------------------------|
| `VITE_FIREBASE_API_KEY` | AIzaSy... |
| `VITE_FIREBASE_AUTH_DOMAIN` | mis-finanzas-86840.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | mis-finanzas-86840 |
| `VITE_FIREBASE_STORAGE_BUCKET` | mis-finanzas-86840.firebasestorage.app |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 391391573973 |
| `VITE_FIREBASE_APP_ID` | 1:391391573973:web:... |

---

## Paso 4 — Activar GitHub Pages

1. Repo → **Settings** → **Pages**
2. **Source:** selecciona **GitHub Actions**
3. Guarda

---

## Paso 5 — Desplegar

1. Repo → pestaña **Actions**
2. Clic en **Deploy to GitHub Pages**
3. Clic en **Run workflow** → **Run workflow**
4. Espera 2–3 minutos hasta que aparezca ✅ verde

---

## Paso 6 — Autorizar dominio en Firebase

1. https://console.firebase.google.com/project/mis-finanzas-86840/authentication/settings
2. **Authorized domains** → **Add domain**
3. Agrega: `TU_USUARIO.github.io`
4. Guarda

---

## Paso 7 — Probar la app online

Abre: **https://TU_USUARIO.github.io/mis-finanzas/**

Inicia sesión con Google. Debería funcionar igual que en local.

---

## Si el repositorio tiene otro nombre

Edita `vite.config.js` línea 7:

```js
const base = process.env.GITHUB_PAGES === 'true' ? '/nombre-de-tu-repo/' : '/';
```

Haz commit y push de nuevo.

---

## Actualizar la app después de cambios

```powershell
cd "D:\Ultimo proyecto"
git add .
git commit -m "Descripción del cambio"
git push
```

GitHub Actions desplegará automáticamente en cada push a `main`.

---

## Problemas comunes

| Problema | Solución |
|----------|----------|
| Pantalla en blanco | Verifica que `base` en vite.config.js coincida con el nombre del repo |
| Error al iniciar sesión | Agrega `TU_USUARIO.github.io` en Firebase Authorized domains |
| Build falla en Actions | Revisa que los 6 secrets estén configurados |
| Error de permisos Firestore | Republica reglas con `publicar-reglas.bat` |

---

## Checklist final

- [ ] Repositorio creado en GitHub
- [ ] Código subido (`git push`)
- [ ] 6 secrets de Firebase configurados
- [ ] GitHub Pages → Source: GitHub Actions
- [ ] Workflow ejecutado con éxito
- [ ] Dominio `TU_USUARIO.github.io` en Firebase Auth
