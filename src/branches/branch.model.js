'use strict';

import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  name: {
    type: String,
    required: [true, 'El nombre de la sucursal es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
  },
  openingTime: {
    type: String,
  },
  closingTime: {
    type: String,
  },
  category: {
    type: String,
    trim: true,
  },
  averagePrice: {
    type: Number,
    min: 0,
  },
  photos: {
    type: [String],
    default: ['photos/default_photos_logo'],
  },
  email: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    enum: ['Operativa', 'En mantenimiento', 'Cerrada'],
    default: 'Operativa',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Registrar el modelo como 'Branch' apuntando a la colección 'branches' (creada por ServerAdmin)
const Branch =
  mongoose.models.Branch ||
  mongoose.model('Branch', branchSchema, 'branches');

export default Branch;
