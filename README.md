# SIGME-UTP

Sistema de gestión de estacionamiento para la UTP. Dos partes que se comunican por HTTP:

```
app-movil (Expo, celular) ──HTTP/HTTPS──▶ backend (Node + Express, :3000) ──▶ Supabase (PostgreSQL)
admin-panel (web, futuro) ──────────────▶ backend
firmware-esp32 (futuro) ──API key───────▶ backend (/parking/sensors/report)
```

---

## 1. Estructura general

```
SIGME-UTP/
├── app-movil/                    App móvil (React Native + Expo Router)
│   ├── .env                      EXPO_PUBLIC_API_URL (no se sube a Git)
│   ├── .env.example
│   └── src/
│       ├── app/                  Pantallas (cada archivo es una ruta)
│       │   ├── _layout.tsx           Stack raíz
│       │   ├── index.tsx             Con token → (tabs), sin token → login
│       │   ├── login.tsx             Solo diseño
│       │   ├── registro.tsx          Registro paso 1
│       │   ├── registro-datos.tsx    Registro paso 2
│       │   ├── terminos.tsx          Registro paso 3
│       │   └── (tabs)/               Pantallas del estudiante
│       ├── components/           SideMenu y piezas reutilizables
│       ├── context/              RegistroContext, MenuContext
│       ├── hooks/                useLogin.ts (lógica)
│       ├── services/             api.ts (cliente del backend + token)
│       ├── styles/               Estilos por pantalla
│       └── constants/
│
└── backend/                      API REST (Node + TypeScript + Express)
    ├── src/
    │   ├── index.ts              Arranca el servidor
    │   ├── app.ts                Express: cors, middlewares, rutas
    │   ├── config/               env, logger (Pino), trace-context
    │   ├── db/pool.ts            Conexión a PostgreSQL
    │   ├── middlewares/          trace, http-logger, auth, rol, rate-limit, error
    │   ├── shared/               errors, types, audit
    │   └── modules/              (cada uno: routes, controller, service, schema)
    │       ├── auth/             users, revoked_tokens
    │       ├── users/            perfil y gestión por admin
    │       ├── vehicles/         vehicles
    │       ├── parking/          parking_lots, parking_spots, sensors
    │       ├── reservations/     reservations
    │       ├── access/           access_history
    │       ├── notifications/    notifications
    │       └── admin/            audit_log, faqs
    ├── db/migrations/001_init.sql
    ├── Dockerfile
    └── package.json
```

---

## 2. Cómo funciona

### Backend: una petición
```
Request → routes → middlewares → controller → service → PostgreSQL → Response
```
- **routes:** URLs y middlewares (`validarToken`, `requerirRol`).
- **controller:** lee `req`, valida, llama al service, responde.
- **service:** lógica de negocio y SQL (no conoce `req`/`res`).
- Errores: `throw new AppError(status, mensaje)`, convertidos por `error.middleware`.

### App: una pantalla
```
Pantalla (diseño) → hook (lógica) → services/api.ts → backend
```
- `api.ts` agrega `Authorization: Bearer <token>` y traduce errores.
- El token se guarda con `expo-secure-store`.
- `index.tsx` lee el token al abrir; el logout lo borra.

### Roles
| Rol | Puede |
|---|---|
| `usuario` | Sus vehículos, reservas, notificaciones, ver plazas |
| `supervisor` | Lo anterior + ingresos/salidas manuales |
| `administrador` | Todo + usuarios, audit log, FAQ, plazas |

El rol viaja en el JWT y **se valida siempre en el backend**. El registro siempre crea `usuario`.

---

## 3. Cómo se conectan (contrato app ↔ backend)

| Tema | Acuerdo |
|---|---|
| URL base | `EXPO_PUBLIC_API_URL` (local: `http://<IP-PC>:3000`; producción: `https://<servicio>.onrender.com`) |
| Auth | `Authorization: Bearer <token>` |
| Login | `POST /auth/login` `{ codigo_utp, password }` → `{ token, usuario: { id, codigo_utp, nombre, rol } }` |
| Registro | `POST /auth/registro` `{ codigo_utp, password, nombre, email, dni, licencia? }` |
| Errores | `{ "error": "mensaje" }` con el código HTTP correspondiente |
| CORS | No aplica a la app nativa; configurar `CORS_ORIGINS` solo para web/admin-panel |

Si cambias una ruta o un campo de respuesta, avisa al otro equipo.

---

## 4. Endpoints

| Módulo | Endpoint | Acceso | Estado |
|---|---|---|---|
| health | `GET /health` | público | listo |
| auth | `POST /auth/registro`, `/login` | público | listo |
| auth | `POST /auth/logout` | logueado | listo |
| users | `GET/PUT /users/me` | usuario | pendiente |
| users | `GET /users`, `PATCH /users/:id/estado` | administrador | pendiente |
| vehicles | CRUD `/vehicles` (propios) | usuario | pendiente |
| parking | `GET /parking/lots`, `/spots` | logueado | pendiente |
| parking | crear/editar lotes y plazas | administrador | pendiente |
| parking | `POST /parking/sensors/report` | ESP32 (API key) | pendiente |
| reservations | `POST /reservations`, `GET /me`, `PATCH /:id/cancelar` | usuario | pendiente |
| access | `POST /access/manual`, `GET /access/historial` | supervisor, administrador | pendiente |
| notifications | `GET /notifications`, `PATCH /:id/leida` | usuario | pendiente |
| admin | `GET /admin/logs`, CRUD `/faqs` | administrador | pendiente |

---

## 5. Puesta en marcha

### Backend
```bash
cd backend
npm install
# crear .env (ver abajo)
npm run dev          # http://localhost:3000/health
```

`.env` del backend:
```
PORT=3000
NODE_ENV=development
SERVICE_NAME=sigme-backend
DATABASE_URL=postgresql://...
JWT_SECRET=<node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=1d
CORS_ORIGINS=
```

Base de datos: ejecutar `db/migrations/001_init.sql` en Supabase y activar **RLS** en todas las tablas (sin policies).

### App móvil
```bash
cd app-movil
npm install
cp .env.example .env     # EXPO_PUBLIC_API_URL=http://<IP-de-tu-PC>:3000
npx expo start -c
```
- No uses `localhost` en el celular; usa la IP de la PC (`ipconfig`).
- Celular y PC en la misma WiFi, con el puerto 3000 permitido en el firewall.
- Reinicia Expo con `-c` cada vez que cambies el `.env`.

---

## 6. Despliegue (Render)

- **Backend:** Web Service, root `backend`, build `npm install && npm run build`, start `npm start`, health check `/health`, `NODE_ENV=production`, variables en el panel (con un `JWT_SECRET` nuevo).
- **App:** cambiar `EXPO_PUBLIC_API_URL` a la URL HTTPS de Render.
- Plan gratis: el servicio se duerme tras ~15 min sin tráfico (la primera petición tarda).

---

## 7. Estado y pendientes

### Hecho
- [x] Backend: estructura completa, config, logger con `traceId`, pool
- [x] Backend: módulo `auth` (registro, login, logout con revocación), middlewares y auditoría
- [x] App: login conectado, token en `expo-secure-store`
- [x] App: 3 pantallas de registro con validaciones locales, menú, notificaciones, historial

### Falta (backend)
1. [ ] Probar `auth` (`npx tsc --noEmit`, `npm run dev`, Postman)
2. [ ] Ejecutar `001_init.sql` en Supabase y activar RLS
3. [ ] Crear usuarios de prueba (usuario, supervisor, administrador)
4. [ ] Módulos: vehicles, parking, reservations (transacción con `FOR UPDATE`), access, notifications, admin, users
5. [ ] WebSocket para plazas en tiempo real
6. [ ] Validación de entrada en los `*.schema.ts`
7. [ ] Pruebas por rol (Supertest/Jest)
8. [ ] Dockerfile y `.env.example`
9. [ ] Desplegar en Render y retirar `auth-service` y `api-gateway`

### Falta (app)
1. [ ] `AuthContext` con `usuario` y `rol`; redirigir por rol
2. [ ] Conectar el registro real: `terminos.tsx` → `POST /auth/registro`
3. [ ] Limpiar `RegistroContext` al terminar
4. [ ] Logout en el `SideMenu` y manejo de 401 (sesión expirada)
5. [ ] Servicios por dominio (`vehicles.service.ts`, `reservations.service.ts`, ...)
6. [ ] Conectar vehículos, reservas, plazas y notificaciones
7. [ ] Carpeta `types/` con los tipos del backend
8. [ ] Quitar `handleRegister` sobrante de `useLogin.ts`

### Seguridad pendiente
- No registrar DNI, licencia ni contraseñas en logs (añadir al `redact` de Pino).
- `JWT_SECRET` nuevo para producción; nunca subir `.env` a Git.
- Limpieza periódica de `revoked_tokens` vencidos.

---

## 8. Futuro
- `admin-panel`: web (React) para administradores, consume el mismo backend.
- `firmware-esp32`: código C++ del microcontrolador; reporta sensores con API key.