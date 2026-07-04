'use strict';

import { Router } from 'express';
import {
  createOrderController,
  getMyOrders,
  getOrderDetails,
  cancelOrderController,
} from './order.controller.js';
import {
  validateCreateOrder,
  validateCancelOrder,
} from '../../middlewares/orders-validators.js';

const router = Router();

// Todas las rutas de pedidos se asumen protegidas por configs/app.js.

// GET /me/history - Obtener historial propio de pedidos
router.get('/me/history', getMyOrders);

// GET /:id - Obtener detalle de pedido propio
router.get('/:id', getOrderDetails);

// POST / - Crear nuevo pedido en mesa
router.post('/', ...validateCreateOrder, createOrderController);

// PUT /:id/cancel - Cancelar pedido propio
router.put('/:id/cancel', ...validateCancelOrder, cancelOrderController);

export default router;
