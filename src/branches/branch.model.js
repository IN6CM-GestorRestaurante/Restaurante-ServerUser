'use strict';

import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del restaurante es obligatorio'],
    trim: true,
    unique: true,
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
  },
  openingTime: {
    type: String,
    required: [true, 'La hora de apertura es obligatoria'],
  },
  closingTime: {
    type: String,
    required: [true, 'La hora de cierre es obligatoria'],
  },
  category: {
    type: String,
    required: [true, 'La categoría gastronómica es obligatoria'],
    enum: [
      'Italiana',
      'Mexicana',
      'Japonesa',
      'Casera',
      'Comida Rápida',
      'Vegetariana',
      'Mariscos',
      'China',
      'Otros',
    ],
  },
  averagePrice: {
    type: Number,
    required: [true, 'El precio promedio es obligatorio'],
    min: 0,
  },
  photos: {
    type: [String],
    default: ['photos/default_photos_logo'],
  },
  email: {
    type: String,
    required: [true, 'El correo de contacto es obligatorio'],
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio'],
    unique: true,
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

// Registrar el modelo como 'Restaurant' apuntando a la colección 'restaurants'
const Restaurant =
  mongoose.models.Restaurant ||
  mongoose.model('Restaurant', restaurantSchema, 'restaurants');
export default Restaurant;
