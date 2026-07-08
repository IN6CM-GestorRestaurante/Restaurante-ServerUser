# Restaurante - Server User API

Este repositorio contiene la **API REST** encargada de la gestión de usuarios regulares (clientes) dentro del ecosistema del sistema de Restaurante. Construido con Node.js, Express y MongoDB, proporciona un backend robusto, seguro y escalable.

## 🚀 Características Principales
- **Autenticación y Autorización:** Generación y validación de tokens JWT.
- **Gestión de Perfiles:** CRUD completo para usuarios clientes.
- **Manejo de Imágenes:** Integración con Cloudinary y Multer para almacenamiento seguro de imágenes de perfil.
- **Seguridad:** Implementación de CORS, Helmet (seguridad HTTP) y Express Rate Limit (prevención de ataques de fuerza bruta).
- **Documentación:** API documentada e interactiva utilizando Swagger UI.

## 🛠 Tecnologías Utilizadas
- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express.js (v5.1.0)
- **Base de Datos:** MongoDB (v8.19.2) mediante Mongoose
- **Seguridad:** JSON Web Tokens (JWT), Bcrypt, Helmet, CORS
- **Almacenamiento en la Nube:** Cloudinary
- **Documentación:** Swagger (swagger-jsdoc, swagger-ui-express)
- **Calidad de Código:** ESLint, Prettier, Husky, Commitizen

## 📁 Estructura del Proyecto
```
Restaurante-ServerUser/
├── configs/         # Configuraciones de base de datos, cloudinary, etc.
├── helpers/         # Funciones auxiliares y utilidades reutilizables
├── middlewares/     # Middlewares de Express (validación de tokens, manejo de errores, etc.)
├── src/             # Código fuente principal (Controladores, Modelos, Rutas)
├── utils/           # Herramientas adicionales de soporte
├── index.js         # Archivo principal de entrada (Entry point)
├── vercel.json      # Configuración de despliegue en Vercel
└── package.json     # Dependencias y scripts del proyecto
```

## 📋 Requisitos Previos
Para poder ejecutar este proyecto de manera local, necesitas instalar:
- [Node.js](https://nodejs.org/es/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/) (Local o MongoDB Atlas)
- Cuenta en [Cloudinary](https://cloudinary.com/) (para gestión de imágenes)

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/IN6CM-GestorRestaurante/Restaurante-ServerUser.git
   cd Restaurante-ServerUser
   ```

2. **Instalar dependencias:**
   Puedes utilizar `npm`, `yarn` o `pnpm` (recomendado ya que incluye un pnpm-lock.yaml).
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo (si existe) y configura las siguientes variables:
   ```env
   PORT=3000
   MONGODB_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_secreto_para_jwt
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

4. **Ejecutar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:3000`.

## 📖 Documentación de la API (Swagger)
Una vez que el servidor esté corriendo, puedes acceder a la interfaz interactiva de Swagger visitando la siguiente ruta en tu navegador:
```
http://localhost:3000/api-docs
```

## 🤝 Contribución
Este proyecto utiliza `Husky` y `Commitizen` para estandarizar los mensajes de commit. Al realizar cambios, utiliza:
```bash
npm run commit
```
Esto abrirá un asistente interactivo para formatear tu commit de acuerdo al estándar convencional.