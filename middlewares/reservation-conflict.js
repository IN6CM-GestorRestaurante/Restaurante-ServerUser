'use strict';

import Reservation from '../src/reservations/reservation.model.js';

// Middleware para detectar conflictos de horario en reservas de mesa
export const checkReservationConflict = async (req, res, next) => {
  try {
    const { table, date, type } = req.body;

    // Solo verificamos conflictos para reservas presenciales de mesa
    if (type !== 'En Mesa') {
      return next();
    }

    if (!table || !date) {
      return res.status(400).json({
        success: false,
        message: 'table y date son requeridos para reservaciones En Mesa',
      });
    }

    const reservationDate = new Date(date);

    const conflicts = await Reservation.findConflictingReservations(
      table,
      reservationDate,
      null
    );

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Esta mesa ya está reservada para el horario seleccionado',
        conflicts: conflicts.map((c) => ({
          id: c._id,
          date: c.date,
          status: c.status,
        })),
      });
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
