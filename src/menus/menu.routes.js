'use strict';

import { Router } from 'express';
import {
  getMenus,
  getCategories,
  getMenusByBranch,
  getMenuById,
} from './menu.controller.js';

const router = Router();

// Rutas públicas (sin auth)
router.get('/', getMenus);
router.get('/categories', getCategories);
router.get('/branch/:branchId', getMenusByBranch);
router.get('/:id', getMenuById);

export default router;
