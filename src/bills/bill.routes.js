'use strict';

import { Router } from 'express';
import {
  checkoutController,
  getMyBillsController,
  getBillByIdController,
} from './bill.controller.js';

const router = Router();

// Todas las rutas de facturas están protegidas por authMiddleware en app.js

// GET / - Obtener mis facturas
router.get('/', getMyBillsController);

// GET /:id - Obtener detalle de una factura
router.get('/:id', getBillByIdController);

// POST /checkout - Procesar carrito y crear factura
router.post('/checkout', checkoutController);

export default router;
