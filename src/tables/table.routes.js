'use strict';

import { Router } from 'express';
import { getTablesByBranch, getTableById } from './table.controller.js';

const router = Router();

// Rutas públicas (sin auth) - consulta de mesas para exploración/reservas
router.get('/branch/:branchId', getTablesByBranch);
router.get('/:id', getTableById);

export default router;
