'use strict';

import {
  registerReservation,
  cancelUserReservation,
  fetchUserReservationHistory,
  fetchOccupiedSlots,
} from './reservation.service.js';

/**
 * Crear nueva reservación.
 */
export const createReservation = async (req, res) => {
  try {
    const userId = req.user._id; // ObjectId de MongoDB
    const reservation = await registerReservation(req.body, userId);

    return res.status(201).json({
      success: true,
      message: 'Reservación creada exitosamente',
      data: reservation,
    });
  } catch (error) {
    console.error('Error en createReservation controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la reservación',
      error: error.message,
    });
  }
};

/**
 * Cancelar reservación del propio usuario.
 */
export const cancelReservation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const reservation = await cancelUserReservation(id, userId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada o no pertenece a tu usuario',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Reservación cancelada exitosamente',
      data: reservation,
    });
  } catch (error) {
    console.error('Error en cancelReservation controller:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al cancelar la reservación',
    });
  }
};

/**
 * Obtener historial de reservaciones del usuario autenticado.
 */
export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await fetchUserReservationHistory(userId);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error en getUserHistory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de reservaciones',
      error: error.message,
    });
  }
};

/**
 * Consultar disponibilidad por sucursal y fecha.
 */
export const checkAvailability = async (req, res) => {
  try {
    const { branchId, date } = req.query;

    if (!branchId || !date) {
      return res.status(400).json({
        success: false,
        message: 'branchId y date son obligatorios',
      });
    }

    const occupied = await fetchOccupiedSlots(branchId, date);

    return res.status(200).json({
      success: true,
      data: occupied,
    });
  } catch (error) {
    console.error('Error en checkAvailability controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar disponibilidad',
      error: error.message,
    });
  }
};
