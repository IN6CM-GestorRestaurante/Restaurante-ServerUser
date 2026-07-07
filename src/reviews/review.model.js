'use strict';

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio'],
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'El restaurante es obligatorio'],
  },
  // Opcional: si se califica un platillo en particular en vez del restaurante en general.
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    default: null,
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es obligatoria'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5'],
  },
  comment: {
    type: String,
    trim: true,
    maxLength: [500, 'El comentario no puede exceder los 500 caracteres'],
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Un usuario solo puede tener una reseña por restaurante (o por platillo si aplica).
reviewSchema.index({ user: 1, restaurant: 1, menuItem: 1 }, { unique: true });
reviewSchema.index({ restaurant: 1 });

const Review =
  mongoose.models.Review || mongoose.model('Review', reviewSchema, 'reviews');
export default Review;
