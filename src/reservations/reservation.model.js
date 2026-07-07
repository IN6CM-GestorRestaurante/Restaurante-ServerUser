'use strict';

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario que realiza la reserva es obligatorio'],
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'El restaurante es obligatorio'],
  },
  // Nombre a mostrar en el panel de staff (ServerAdmin lo requiere siempre para
  // reservas de walk-in). Para reservas de cliente se autocompleta desde su perfil.
  guestName: {
    type: String,
    trim: true,
  },
  guestsCount: {
    type: Number,
    required: [true, 'La cantidad de personas es obligatoria'],
    min: [1, 'Debe ser al menos 1 persona'],
    default: 1,
  },
  type: {
    type: String,
    required: [true, 'El tipo de reservación es obligatorio'],
    enum: ['En Mesa', 'Para llevar', 'A domicilio'],
    default: 'En Mesa',
  },
  tables: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    validate: {
      validator: function (value) {
        return this.type !== 'En Mesa' || (Array.isArray(value) && value.length > 0);
      },
      message: 'La mesa es obligatoria para reservaciones en el local',
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
reservationSchema.index({ branch: 1 });
reservationSchema.index({ date: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ tables: 1, date: 1 });

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
    tables: tableId,
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
