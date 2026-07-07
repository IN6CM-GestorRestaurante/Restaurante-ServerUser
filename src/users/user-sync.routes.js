'use strict';

import { Router } from 'express';
import { syncUser } from './user.controller.js';
import { requireInternalSecret } from '../../middlewares/internal-service.middleware.js';

const router = Router();

// Llamado por auth-node justo despues de registrar un usuario en Postgres,
// para crear/actualizar su registro espejo en esta base Mongo. No requiere
// JWT de usuario (todavia no existe sesion en ese momento), sino el secreto
// compartido servicio-a-servicio.
router.post('/sync', requireInternalSecret, syncUser);

export default router;
