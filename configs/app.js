'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  generalUserLimit,
  reservationLimit,
} from '../middlewares/rate-limit-user.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

import branchRoutes from '../src/branches/branch.routes.js';
import menuRoutes from '../src/menus/menu.routes.js';
import tableRoutes from '../src/tables/table.routes.js';
import reviewRoutes from '../src/reviews/review.routes.js';
import userRoutes from '../src/users/user.routes.js';
import userSyncRoutes from '../src/users/user-sync.routes.js';
import reservationRoutes from '../src/reservations/reservation.routes.js';
import orderRoutes from '../src/orders/order.routes.js';
import billRoutes from '../src/bills/bill.routes.js';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const mountRoutes = (app, basePath) => {
  // Rutas públicas (reviews maneja su propio auth mixto internamente)
  app.use(`${basePath}/branches`, branchRoutes);
  app.use(`${basePath}/menus`, menuRoutes);
  app.use(`${basePath}/tables`, tableRoutes);
  app.use(`${basePath}/reviews`, reviewRoutes);

  app.get(`${basePath}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'Restaurante User Server',
    });
  });

  // Sync interno servicio-a-servicio (secreto compartido, no JWT de usuario).
  // Se monta antes de la ruta autenticada de /users para que /users/sync no
  // pase por authMiddleware.
  app.use(`${basePath}/users`, userSyncRoutes);

  // Rutas protegidas (Requieren token)
  app.use(`${basePath}/users`, authMiddleware, userRoutes);
  app.use(
    `${basePath}/reservations`,
    authMiddleware,
    reservationLimit,
    reservationRoutes
  );
  app.use(`${basePath}/orders`, authMiddleware, generalUserLimit, orderRoutes);
  app.use(`${basePath}/bills`, authMiddleware, generalUserLimit, billRoutes);
};

const routes = (app) => {
  // Documentación de la API
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  mountRoutes(app, '/restauranteUser/v1');
  mountRoutes(app, '/api/user');

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint no encontrado en User API',
    });
  });
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3003;
  app.set('trust proxy', 1);

  try {
    await dbConnection();
    middlewares(app);
    routes(app);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Restaurante User Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/user/health`);
    });
  } catch (err) {
    console.error(`Error starting User Server: ${err.message}`);
    process.exit(1);
  }
};
