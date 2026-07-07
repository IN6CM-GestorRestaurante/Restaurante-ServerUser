'use strict';

import Reservation from './reservation.model.js';
import Menu from '../menus/menu.model.js';
import { User } from '../users/user.model.js';
import { computeEffectivePrice } from '../../helpers/pricing.js';

// El request/response mantiene los nombres `restaurant`/`table` (singular) por
// compatibilidad con los clientes ya construidos; internamente se guarda como
// `branch`/`tables` para calzar con el esquema de ServerAdmin (misma colección).
const toClientShape = (reservation) => {
  if (!reservation) return reservation;
  const obj = reservation.toObject ? reservation.toObject() : reservation;
  const { branch, tables, ...rest } = obj;
  return {
    ...rest,
    restaurant: branch,
    table: Array.isArray(tables) ? tables[0] : tables,
  };
};

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
        totalPrice += computeEffectivePrice(menuItem) * (item.quantity || 1);
      }
    }
  }

  const { restaurant, table, guestsCount, guestName, ...rest } = reservationData;

  let resolvedGuestName = guestName;
  if (!resolvedGuestName) {
    const user = await User.findById(userId);
    resolvedGuestName = user
      ? `${user.name || ''} ${user.surname || ''}`.trim() || user.username
      : undefined;
  }

  const reservation = new Reservation({
    ...rest,
    branch: restaurant,
    tables: table ? [table] : undefined,
    guestsCount: guestsCount || 1,
    guestName: resolvedGuestName,
    user: userId,
    status: 'Pendiente',
    totalPrice,
  });

  await reservation.save();
  return toClientShape(reservation);
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

  return toClientShape(reservation);
};

/**
 * Obtener historial de reservaciones del usuario.
 */
export const fetchUserReservationHistory = async (userId) => {
  const reservations = await Reservation.find({ user: userId })
    .populate('branch', 'name address photos averagePrice')
    .populate('tables', 'number capacity')
    .populate('items.menuItem', 'name price image')
    .sort({ date: -1 });

  return reservations.map(toClientShape);
};

/**
 * Consultar lapsos de tiempo ocupados para un restaurante en una fecha.
 */
export const fetchOccupiedSlots = async (restaurantId, date) => {
  const searchDate = new Date(date);
  searchDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(searchDate);
  nextDay.setDate(searchDate.getDate() + 1);

  const slots = await Reservation.find({
    branch: restaurantId,
    status: { $nin: ['Cancelada'] },
    date: {
      $gte: searchDate,
      $lt: nextDay,
    },
  })
    .select('date tables -_id')
    .populate('tables', 'number');

  return slots.map((slot) => ({
    date: slot.date,
    table: slot.tables?.[0],
  }));
};
