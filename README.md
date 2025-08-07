# Video Game Store

Proyecto final de la Unidad 2 para la materia de Aplicaciones Web Progresivas.

## Descripción

Aplicación web progresiva (PWA) que simula una tienda de videojuegos. Permite registro, autenticación y visualización de productos. Backend en Node.js/Express y autenticación con Firebase.

## Requisitos previos

- Node.js y npm instalados
- Cuenta en [Firebase](https://firebase.google.com/)

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/video-game-store.git
   cd video-game-store
   ```

2. **Instala dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```

3. **(Opcional) Instala nodemon para desarrollo:**
   ```bash
   npm install -g nodemon
   ```

4. **Configura Firebase:**
   - Ve a la consola de Firebase > Configuración del proyecto > Cuentas de servicio.
   - Descarga el archivo `serviceAccountKey.json`.
   - Renómbralo como `firebase-credentials.json` y colócalo en la carpeta `backend/`.

5. **Crea el archivo `.env` en `backend/` con tus variables de entorno si es necesario.**

6. **Inicia el servidor:**
   - Para producción:
     ```bash
     npm start
     ```
   - Para desarrollo (con reinicio automático):
     ```bash
     npm run dev
     ```

7. **Lo del paso 6 abre el frontend:**
   - Abre `frontend/index.html` en tu navegador.

## Estructura del proyecto

```
video-game-store/
  backend/
    controllers/
    routes/
    test/
    index.js
    firebase.js
    .env
    firebase-credentials.json
    package.json
  frontend/
    index.html
    login.html
    register.html
    productos.html
    acerca.html
    manifest.json
    service-worker.js
    css/
    js/
    icons/
    fallback/
  README.md
```

## Notas de seguridad

- **No subas tus archivos `.env` ni `firebase-credentials.json` al repositorio.**  
  Ya están ignorados en `.gitignore`.

## Autores

Daniela Ruiz
Gerardo Sanchez
Jocelyn Muñoz

---
