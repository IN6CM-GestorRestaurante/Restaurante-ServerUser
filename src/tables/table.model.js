'use strict';

import mongoose from 'mongoose';

// Espejo de solo lectura del modelo Table de ServerAdmin (misma colección 'tables').
// Este servicio no crea ni modifica mesas, solo las consulta para exploración/reservas.
const tableSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  number: {
    type: String,
    trim: true,
  },
  capacity: {
    type: Number,
  },
  location: {
    type: String,
    enum: ['Terraza', 'Sala Principal', 'VIP', 'Bar', 'Ventana', 'Balcón', 'Otro'],
  },
  status: {
    type: String,
    enum: ['Disponible', 'Ocupada', 'Reservada', 'Mantenimiento'],
    default: 'Disponible',
  },
  description: {
    type: String,
    trim: true,
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

const Table =
  mongoose.models.Table || mongoose.model('Table', tableSchema, 'tables');

export default Table;
