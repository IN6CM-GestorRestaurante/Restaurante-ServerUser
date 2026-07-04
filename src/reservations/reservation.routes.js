'use strict';

import { Router } from 'express';
import {
  createReservation,
  cancelReservation,
  getUserHistory,
  checkAvailability,
} from './reservation.controller.js';
import {
  validateCreateReservation,
  validateCancelReservation,
} from '../../middlewares/reservation-validators.js';
import { checkReservationConflict } from '../../middlewares/reservation-conflict.js';

const router = Router();

// Todas las rutas de reservas se asumen protegidas mediante configs/app.js,
// pero los validadores aplican validaciones adicionales y validateJWT inline.

// GET /availability - Consultar disponibilidad de mesas
router.get('/availability', checkAvailability);

// GET /me/history - Obtener historial propio de reservaciones
router.get('/me/history', getUserHistory);

// POST / - Crear nueva reservación
router.post(
  '/',
  ...validateCreateReservation,
  checkReservationConflict,
  createReservation
);

// PUT /:id/cancel - Cancelar reservación propia
router.put('/:id/cancel', ...validateCancelReservation, cancelReservation);

export default router;
