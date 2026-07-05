'use strict';

import Reservation from './reservation.model.js';
import Menu from '../menus/menu.model.js';

/**
 * Registrar una nueva reservación.
 */
export const registerReservation = async (reservationData, userId) => {
  let totalPrice = 0;

  // Si incluye pre-orden de platos, calcular el total de precio unitario
  if (reservationData.items && reservationData.items.length > 0) {
    for (const item of reservationData.items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (menuItem) {
        totalPrice += (menuItem.price || 0) * (item.quantity || 1);
      }
    }
  }

  const reservation = new Reservation({
    ...reservationData,
    user: userId,
    status: 'Pendiente',
    totalPrice,
  });

  await reservation.save();
  return reservation;
};

/**
 * Cancelar una reservación si pertenece al usuario y su estado lo permite.
 */
export const cancelUserReservation = async (reservationId, userId) => {
  const reservation = await Reservation.findOne({
    _id: reservationId,
    user: userId,
  });

  if (!reservation) return null;

  if (['Cancelada', 'Completada'].includes(reservation.status)) {
    throw new Error(
      `No se puede cancelar una reserva con estado ${reservation.status}`
    );
  }

  reservation.status = 'Cancelada';
  await reservation.save();

  return reservation;
};

/**
 * Obtener historial de reservaciones del usuario.
 */
export const fetchUserReservationHistory = async (userId) => {
  return await Reservation.find({ user: userId })
    .populate('restaurant', 'name address photos averagePrice')
    .populate('table', 'number capacity')
    .populate('items.menuItem', 'name price image')
    .sort({ date: -1 });
};

/**
 * Consultar lapsos de tiempo ocupados para un restaurante en una fecha.
 */
export const fetchOccupiedSlots = async (restaurantId, date) => {
  const searchDate = new Date(date);
  searchDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(searchDate);
  nextDay.setDate(searchDate.getDate() + 1);

  return await Reservation.find({
    restaurant: restaurantId,
    status: { $nin: ['Cancelada'] },
    date: {
      $gte: searchDate,
      $lt: nextDay,
    },
  })
    .select('date table -_id')
    .populate('table', 'number');
};
