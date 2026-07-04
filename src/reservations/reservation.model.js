'use strict';

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario que realiza la reserva es obligatorio'],
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'El restaurante es obligatorio'],
  },
  type: {
    type: String,
    required: [true, 'El tipo de reservación es obligatorio'],
    enum: ['En Mesa', 'Para llevar', 'A domicilio'],
    default: 'En Mesa',
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: function () {
      return this.type === 'En Mesa';
    },
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
      },
      quantity: {
        type: Number,
        min: [1, 'La cantidad mínima es 1'],
      },
    },
  ],
  date: {
    type: Date,
    required: [true, 'La fecha y hora de la reservación es obligatoria'],
  },
  deliveryAddress: {
    type: String,
    trim: true,
    required: function () {
      return this.type === 'A domicilio';
    },
  },
  status: {
    type: String,
    enum: ['Pendiente', 'Confirmada', 'En curso', 'Completada', 'Cancelada'],
    default: 'Pendiente',
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
    maxLength: [300, 'Las notas no pueden exceder los 300 caracteres'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Índice para búsquedas rápidas
reservationSchema.index({ user: 1 });
reservationSchema.index({ restaurant: 1 });
reservationSchema.index({ date: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ table: 1, date: 1 });

/**
 * Buscar reservaciones conflictivas para la misma mesa en el local.
 * Consideramos conflicto si hay otra reserva activa de tipo 'En Mesa' para la misma mesa
 * dentro de un rango de 2 horas antes o después de la fecha solicitada.
 */
reservationSchema.statics.findConflictingReservations = function (
  tableId,
  date,
  excludeId = null
) {
  const reservationTime = new Date(date);
  const twoHours = 2 * 60 * 60 * 1000;
  const startTime = new Date(reservationTime.getTime() - twoHours);
  const endTime = new Date(reservationTime.getTime() + twoHours);

  const query = {
    table: tableId,
    type: 'En Mesa',
    status: { $in: ['Pendiente', 'Confirmada', 'En curso'] },
    date: {
      $gte: startTime,
      $lte: endTime,
    },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return this.find(query);
};

const Reservation =
  mongoose.models.Reservation ||
  mongoose.model('Reservation', reservationSchema, 'reservations');
export default Reservation;
