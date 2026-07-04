# Restaurante Server User - API Pública de Usuarios

API RESTful para usuarios finales del ecosistema **Gestor de Restaurante**. Consumida principalmente por la aplicación móvil del cliente.

## Descripción

Permite a los usuarios autenticados explorar sucursales (restaurantes) y sus menús de platos, crear y gestionar reservaciones (con detección de conflictos de mesa), realizar pedidos en mesa directamente desde la app móvil, y administrar su perfil extendido de usuario (incluyendo sus libretas de direcciones de entrega de comida). Comparte la base de datos MongoDB con `Restaurante-ServerAdmin`.

## Tech Stack

- **Runtime**: Node.js 20+ (ESM)
- **Framework**: Express 5.x
- **Base de Datos**: MongoDB (compartida con server-admin)
- **ODM**: Mongoose 8.x
- **Autenticación**: JWT (emitido por auth-node / .NET Auth Service)
- **Seguridad**: Helmet, CORS, Rate Limiting (por IP y por usuario)

## Instalación

```bash
cd Restaurante-ServerUser
pnpm install
cp .env.example .env
pnpm dev
```

## Variables de Entorno

```env
PORT=3003
URI_MONGODB=mongodb://localhost:27017/restaurante_db
SECRETORPRIVATEKEY=Restaurante_Super_Secret_Key_2026_DotNet8
JWT_ISSUER=AuthService
JWT_AUDIENCE=AuthService
CLOUDINARY_CLOUD_NAME=dueikakf8
CLOUDINARY_API_KEY=119292848621234
CLOUDINARY_API_SECRET=ckVTJkNQUjUatlwOcYFMg-9hAyM
ADMIN_SERVICE_URL=http://localhost:3001
AUTH_NODE_URL=http://localhost:3007/api/v1
```

## Estructura de Directorios

```
Restaurante-ServerUser/
├── configs/
│   ├── app.js               # Express bootstrap (soporta /restauranteUser/v1 y /api/user)
│   ├── cors-configuration.js
│   ├── db.js                # Conexión Mongoose a MongoDB
│   ├── helmet-configuration.js
│   └── swagger.js           # Swagger documentation spec
├── helpers/
│   └── profile-enrichment.js # Une perfil de MongoDB con claims de Postgres
├── middlewares/
│   ├── auth.middleware.js   # Middleware JWT principal
│   ├── check-validators.js  # Formateador express-validator
│   ├── file-uploader.js     # Integración Multer + Cloudinary
│   ├── handle-errors.js     # Capturador global de errores
│   ├── rate-limit-user.js   # Limitadores por usuario
│   ├── request-limit.js     # Limitador por IP
│   └── validate-JWT.js      # Validador de firma inline
├── src/
│   ├── auth/                # Conexión inter-servicio con auth-node
│   ├── branches/            # Sucursales / Restaurantes (Público)
│   ├── menus/               # Platos y categorías (Público)
│   ├── orders/              # Pedidos en mesa (Protegido)
│   ├── reservations/        # Reservaciones y disponibilidad (Protegido)
│   └── users/               # Perfiles y direcciones (Protegido)
├── utils/
│   ├── adminClient.js       # Comunicaciones con ServerAdmin
│   └── authClient.js        # Comunicaciones con auth-node
└── index.js
```

## Scripts

```bash
pnpm dev            # Desarrollo con nodemon
pnpm start          # Producción
pnpm lint           # ESLint
pnpm lint:fix       # ESLint con auto-fix
pnpm format         # Prettier (escribir)
pnpm format:check   # Prettier (verificar)
pnpm commit         # Commit interactivo (Commitizen)
```

## Endpoints

**Base paths soportados:**
* `/api/user` (Recomendado)
* `/restauranteUser/v1` (Alineado con Kspots)

**Puerto por defecto:** `3003`

### Sucursales (Público)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/branches` | Listar restaurantes activos |
| GET | `/branches/:id` | Detalle de una sucursal |

### Platos y Categorías (Público)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/menus` | Listar platos con paginación y filtros |
| GET | `/menus/categories` | Obtener categorías gastronómicas |
| GET | `/menus/branch/:branchId`| Obtener menú de una sucursal |
| GET | `/menus/:id` | Detalle de un plato |

### Perfil de Usuario (JWT)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/users/profile` | Obtener perfil completo enriquecido |
| PUT | `/users/profile` | Actualizar perfil (displayName, favorito, etc.) |
| POST | `/users/profile/avatar` | Subir foto de perfil (multipart) |
| POST | `/users/profile/addresses` | Agregar dirección de entrega |
| DELETE | `/users/profile/addresses/:id`| Eliminar dirección de entrega |
| PATCH | `/users/profile/addresses/:id/default`| Establecer dirección predeterminada |

### Reservaciones (JWT)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/reservations/availability` | Consultar mesas ocupadas por fecha |
| GET | `/reservations/me/history` | Historial propio de reservaciones |
| POST | `/reservations` | Crear reservación En Mesa, Domicilio o Para Llevar |
| PUT | `/reservations/:id/cancel` | Cancelar reservación propia |

### Pedidos (JWT)

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/orders/me/history` | Historial de pedidos |
| GET | `/orders/:id` | Obtener detalles del pedido |
| POST | `/orders` | Crear pedido en mesa (precios verificados) |
| PUT | `/orders/:id/cancel` | Cancelar pedido propio (si está ABIERTA y sin cocinar) |

### Health Check

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| GET | `/health` | Comprobar salud del microservicio |

## Documentación Interactiva

Puedes visualizar la interfaz interactiva de Swagger UI accediendo localmente a:
`http://localhost:3003/api-docs`

## Licencia

MIT