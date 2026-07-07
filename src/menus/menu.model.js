'use strict';

import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'El menú debe estar vinculado a un restaurante'],
  },
  name: {
    type: String,
    required: [true, 'El nombre del plato es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
  },
  ingredients: {
    type: [String],
    required: [true, 'Debe indicar al menos un ingrediente'],
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'El tipo de plato (categoría) es obligatorio'],
    enum: [
      'Entrada',
      'Plato Fuerte',
      'Postre',
      'Bebida',
      'Acompañamiento',
      'Otro',
    ],
  },
  image: {
    type: String,
    default: 'menus/default_menu',
  },
  // Espejo del campo de promociones que administra ServerAdmin sobre el mismo platillo.
  promotion: {
    isActive: { type: Boolean, default: false },
    discountType: { type: String, enum: ['PERCENTAGE', 'FIXED_PRICE', 'FIXED', 'PORCENTAJE', 'FIJO'] },
    discountValue: { type: Number, min: 0 },
    startsAt: { type: Date },
    endsAt: { type: Date },
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

// Registrar el modelo como 'Menu' apuntando a la colección 'menus'
const Menu =
  mongoose.models.Menu || mongoose.model('Menu', menuSchema, 'menus');
export default Menu;
