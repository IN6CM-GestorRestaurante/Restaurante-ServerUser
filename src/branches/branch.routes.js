'use strict';

import { Router } from 'express';
import { getBranches, getBranchById } from './branch.controller.js';

const router = Router();

// Rutas públicas (sin auth)
router.get('/', getBranches);
router.get('/:id', getBranchById);

export default router;
